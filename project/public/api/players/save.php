<?php
require_once '../db.php';

// Handle POST request to save a player's score
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id']) || !isset($data['nickname'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit();
    }
    
    $playerId = sanitizeInput($data['id']);
    $nickname = sanitizeInput($data['nickname']);
    $correctAnswers = isset($data['correctAnswers']) ? intval($data['correctAnswers']) : 1;
    
    if (empty($playerId) || empty($nickname)) {
        http_response_code(400);
        echo json_encode(['error' => 'Player ID and nickname cannot be empty']);
        exit();
    }
    
    $conn = getDbConnection();
    
    // Check if player already exists
    $stmt = $conn->prepare("SELECT * FROM players WHERE player_id = ?");
    $stmt->bind_param("s", $playerId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Update existing player
        $player = $result->fetch_assoc();
        $newCorrectAnswers = $player['correct_answers'] + $correctAnswers;
        
        $updateStmt = $conn->prepare("UPDATE players SET nickname = ?, correct_answers = ? WHERE player_id = ?");
        $updateStmt->bind_param("sis", $nickname, $newCorrectAnswers, $playerId);
        
        if (!$updateStmt->execute()) {
            handleDbError($conn, "UPDATE players", $updateStmt->error);
        }
        
        $updateStmt->close();
    } else {
        // Insert new player
        $insertStmt = $conn->prepare("INSERT INTO players (player_id, nickname, correct_answers) VALUES (?, ?, ?)");
        $insertStmt->bind_param("ssi", $playerId, $nickname, $correctAnswers);
        
        if (!$insertStmt->execute()) {
            handleDbError($conn, "INSERT INTO players", $insertStmt->error);
        }
        
        $insertStmt->close();
    }
    
    // Return success message
    echo json_encode(['success' => true]);
    
    $stmt->close();
    $conn->close();
    exit();
}

// Handle invalid request methods
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);