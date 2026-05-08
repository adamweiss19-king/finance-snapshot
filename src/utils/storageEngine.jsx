// utils/storageEngine.js

const STORAGE_KEY = 'wealth_visualizer_snapshots_v2'; 

import { supabase } from './supabaseClient';
import CryptoJS from 'crypto-js';

const MASTER_KEY = import.meta.env.VITE_MASTER_KEY;

// 🔒 THE SCRAMBLER
const encryptData = (data) => {
  const dataString = JSON.stringify(data);
  const scrambled = CryptoJS.AES.encrypt(dataString, MASTER_KEY).toString();
  // We wrap it in a JSON object so Supabase doesn't get confused
  return { vault_data: scrambled }; 
};

// 🔓 THE UNSCRAMBLER
const decryptData = (encryptedObj) => {
  if (!encryptedObj) return null;
  
  // Safety check: If it's old unencrypted data, just return it normally
  if (!encryptedObj.vault_data) return encryptedObj; 

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedObj.vault_data, MASTER_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Vault Error: Could not decrypt data.", error);
    return null;
  }
};

// Retrieve all snapshots from Supabase and format them for React
export const getSnapshots = async () => {
  try {
    // 1. Check who is currently logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const localData = localStorage.getItem(STORAGE_KEY);
      return localData ? JSON.parse(localData) : {};
    }

    // 2. Fetch all workspace rowsma for this user
    const { data, error } = await supabase
      .from('workspaces')
      .select('year, snapshot_data');

    if (error) throw error;

    // 3. The "Translation Trick": Convert the array of database rows 
    // back into your single { "2024": {...}, "2025": {...} } object.
    const formattedSnapshots = {};
    if (data) {
      data.forEach((row) => {
        formattedSnapshots[row.year] = decryptData(row.snapshot_data);
      });
    }
    
    return formattedSnapshots;
  } catch (error) {
    console.error("Storage Engine Error: Failed to fetch snapshots.", error);
    return {}; 
  }
};


export const saveSnapshot = async (year, fullState, type = 'plan', status = 'open') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const localData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      let snapshotData = localData[year] || { status: status, plan: {}, actuals: null };
      snapshotData[type] = fullState;
      snapshotData.status = status;
      
      localData[year] = snapshotData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localData));
      return snapshotData; // Return just the year we saved
    }
    const { data: existingRow } = await supabase
      .from('workspaces')
      .select('snapshot_data')
      .eq('year', year)
      .maybeSingle(); 

    let snapshotData = existingRow?.snapshot_data || { status: status, plan: {}, actuals: null };
    snapshotData[type] = fullState;
    snapshotData.status = status;

    const { error } = await supabase
      .from('workspaces')
      .upsert({ user_id: user.id, year: year, snapshot_data: encryptData(snapshotData) }, 
      { onConflict: 'user_id, year' });

    if (error) throw error;

    // SUSTAINABLE CHANGE: Return ONLY the data for the year we just saved
    return snapshotData; 

  } catch (error) {
    console.error("Storage Engine Error: Failed to save snapshot.", error);
    return null; // Return null so the UI knows the save failed
  }
};

/// Delete a specific year's snapshot from Supabase
export const deleteSnapshot = async (year) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    // 🕵️‍♂️ GUEST MODE FALLBACK
    if (!user) {
      const localData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      delete localData[year]; // Delete just this year
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localData));
      return true; // Tell App.jsx it worked
    }

    // ☁️ CLOUD MODE (Your existing code)
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('user_id', user.id)
      .eq('year', year);

    if (error) throw error;
    return true;

  } catch (error) {
    console.error("Storage Engine Error: Failed to delete snapshot.", error);
    return false; 
  }
};

export const renameSnapshot = async (oldYear, newYear) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be logged in.");

    // The 1-Step Update: Just change the year on the existing row!
    const { error } = await supabase
      .from('workspaces')
      .update({ year: newYear })
      .eq('year', oldYear)
      .eq('user_id', user.id); // Extra safety check to only touch this user's data

    if (error) throw error;
    return true;
    
  } catch (error) {
    console.error("Storage Engine Error: Failed to rename.", error);
    return false;
  }
};

export const clearAllSnapshots = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    // 🕵️‍♂️ GUEST MODE FALLBACK
    if (!user) {
      localStorage.removeItem(STORAGE_KEY); // Nuke the entire key
      return true;
    }

    // ☁️ CLOUD MODE (Your existing code)
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('user_id', user.id); 

    if (error) throw error;
    return true;
    
  } catch (error) {
    console.error("Nuke failed:", error);
    return false;
  }
};

export const loadDemoProfileIntoStorage = (demoData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
    return demoData;
  } catch (error) {
    console.error("Storage Engine Error: Failed to load demo profile.", error);
    return false;
  }
};