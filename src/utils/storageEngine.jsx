// utils/storageEngine.js

const STORAGE_KEY = 'wealth_visualizer_snapshots_v2'; 

import { supabase } from './supabaseClient';

// Retrieve all snapshots from Supabase and format them for React
export const getSnapshots = async () => {
  try {
    // 1. Check who is currently logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {}; // If no one is logged in, return empty state

    // 2. Fetch all workspace rows for this user
    const { data, error } = await supabase
      .from('workspaces')
      .select('year, snapshot_data');

    if (error) throw error;

    // 3. The "Translation Trick": Convert the array of database rows 
    // back into your single { "2024": {...}, "2025": {...} } object.
    const formattedSnapshots = {};
    if (data) {
      data.forEach((row) => {
        formattedSnapshots[row.year] = row.snapshot_data;
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
    if (!user) throw new Error("User must be logged in to save.");

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
      .upsert({ user_id: user.id, year: year, snapshot_data: snapshotData }, { onConflict: 'user_id, year' });

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
    if (!user) throw new Error("User must be logged in to delete.");

    // Tell Supabase to delete the row where user_id and year match
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('user_id', user.id)
      .eq('year', year);

    if (error) throw error;
    
    return true; // Return true so App.jsx knows it was successful

  } catch (error) {
    console.error("Storage Engine Error: Failed to delete snapshot.", error);
    return false; // Return false if it fails
  }
};

export const renameSnapshot = async (oldYear, newYear) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be logged in.");

    // 1. Get the data from the old year
    const { data: row, error: fetchError } = await supabase
      .from('workspaces')
      .select('snapshot_data')
      .eq('year', oldYear)
      .single();

    if (fetchError) throw fetchError;

    // 2. Create the new year row with the same data
    const { error: insertError } = await supabase
      .from('workspaces')
      .insert({
        user_id: user.id,
        year: newYear,
        snapshot_data: row.snapshot_data
      });

    if (insertError) throw insertError;

    // 3. Delete the old year row
    const { error: deleteError } = await supabase
      .from('workspaces')
      .delete()
      .eq('year', oldYear);

    if (deleteError) throw deleteError;

    return true;
  } catch (error) {
    console.error("Storage Engine Error: Failed to rename.", error);
    return false;
  }
};
export const clearAllSnapshots = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('user_id', user.id); // The "Nuke" command

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