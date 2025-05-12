import { Riddle, Player, DbConfig } from '../types';

const API_BASE_URL = '/api';

// Fetch a random riddle
export async function fetchRandomRiddle(): Promise<Riddle> {
  try {
    const response = await fetch(`${API_BASE_URL}/riddles/random.php`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch random riddle');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching random riddle:', error);
    throw error;
  }
}

// Fetch all riddles
export async function fetchRiddles(): Promise<Riddle[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/riddles/list.php`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch riddles');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching riddles:', error);
    throw error;
  }
}

// Create a new riddle
export async function createRiddle(riddle: Riddle): Promise<Riddle> {
  try {
    const response = await fetch(`${API_BASE_URL}/riddles/create.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(riddle),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create riddle');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating riddle:', error);
    throw error;
  }
}

// Update an existing riddle
export async function updateRiddle(riddle: Riddle): Promise<Riddle> {
  try {
    const response = await fetch(`${API_BASE_URL}/riddles/update.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(riddle),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update riddle');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating riddle:', error);
    throw error;
  }
}

// Delete a riddle
export async function deleteRiddle(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/riddles/delete.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete riddle');
    }
  } catch (error) {
    console.error('Error deleting riddle:', error);
    throw error;
  }
}

// Save a player's score
export async function savePlayerScore(player: Player): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/players/save.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(player),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save player score');
    }
  } catch (error) {
    console.error('Error saving player score:', error);
    throw error;
  }
}

// Fetch top players
export async function fetchTopPlayers(limit: number = 5): Promise<Player[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/players/top.php?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch top players');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching top players:', error);
    throw error;
  }
}

// Setup the database
export async function setupDatabase(config: DbConfig): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/setup/index.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) {
      throw new Error('Failed to setup database');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}