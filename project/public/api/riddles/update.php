<?php
require_once '../db.php';

// Handle POST request to update an existing riddle
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id']) || !isset($data['question']) || !isset($data['answer'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit();
    }
    
    $id = intval($data['id']);
    $question = sanitizeInput($data['question']);
    $answer = sanitizeInput($data['answer']);
    
    if ($id <= 0 || empty($question) || empty($answer)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid input data']);
        exit();
    }
    
    $conn = getDbConnection();
    
    // Update the riddle
    $stmt = $conn->prepare("UPDATE riddles SET question = ?, answer = ? WHERE id = ?");
    $stmt->bind_param("ssi", $question, $answer, $id);
    
    if (!$stmt->execute()) {
        handleDbError($conn, "UPDATE riddles", $stmt->error);
    }
    
    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Riddle not found']);
        $stmt->close();
        $conn->close();
        exit();
    }
    
    // Return the updated riddle
    echo json_encode([
        'id' => $id,
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