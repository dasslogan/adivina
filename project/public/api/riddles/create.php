<?php
require_once '../db.php';

// Handle POST request to create a new riddle
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['question']) || !isset($data['answer'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit();
    }
    
    $question = sanitizeInput($data['question']);
    $answer = sanitizeInput($data['answer']);
    
    if (empty($question) || empty($answer)) {
        http_response_code(400);
        echo json_encode(['error' => 'Question and answer cannot be empty']);
        exit();
    }
    
    $conn = getDbConnection();
    
    // Insert new riddle
    $stmt = $conn->prepare("INSERT INTO riddles (question, answer) VALUES (?, ?)");
    $stmt->bind_param("ss", $question, $answer);
    
    if (!$stmt->execute()) {
        handleDbError($conn, "INSERT INTO riddles", $stmt->error);
    }
    
    $newId = $conn->insert_id;
    
    // Return the newly created riddle
    echo json_encode([
        'id' => $newId,
        'question' => $question,
        'answer' => $answer
    ]);
    
    $stmt->close();
    $conn->close();
    exit();
}

// Handle invalid request methods
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);