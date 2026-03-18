// utils/storageEngine.js

const STORAGE_KEY = 'wealth_visualizer_snapshots_v2'; 

// Retrieve all snapshots from local storage. Returns empty object if none exist.
export const getSnapshots = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {}; 
  } catch (error) {
    console.error("Storage Engine Error. Returning empty state.", error);
    return {}; 
  }
};

// Save or update a specific year's plan or actuals
export const saveSnapshot = (year, fullState, type = 'plan', status = 'open') => {
  try {
    const existingSnapshots = getSnapshots();
    
    // If the year doesn't exist yet, initialize it
    if (!existingSnapshots[year]) {
      existingSnapshots[year] = { status: status, plan: {}, actuals: null };
    }
    
    // Update either the plan or the actuals based on the type passed in
    existingSnapshots[year][type] = fullState;
    existingSnapshots[year].status = status;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingSnapshots));
    return existingSnapshots;
  } catch (error) {
    console.error("Storage Engine Error: Failed to save snapshot.", error);
    return getSnapshots();
  }
};

// Delete a specific year's snapshot
export const deleteSnapshot = (year) => {
  try {
    const existingSnapshots = getSnapshots();
    delete existingSnapshots[year]; // Remove the year from the object
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingSnapshots));
    return existingSnapshots;
  } catch (error) {
    console.error("Storage Engine Error: Failed to delete snapshot.", error);
    return getSnapshots();
  }
};

// Nuke the entire database
export const clearAllSnapshots = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return {};
  } catch (error) {
    console.error("Storage Engine Error: Failed to clear storage.", error);
    return {};
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