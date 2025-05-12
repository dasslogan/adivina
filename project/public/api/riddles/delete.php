<?php
require_once '../db.php';

// Handle POST request to delete a riddle
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing riddle ID']);
        exit();
    }
    
    $id = intval($data['id']);
    
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid riddle ID']);
        exit();
    }
    
    $conn = getDbConnection();
    
    // Delete the riddle
    $stmt = $conn->prepare("DELETE FROM riddles WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if (!$stmt->execute()) {
        handleDbError($conn, "DELETE FROM riddles", $stmt->error);
    }
    
    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Riddle not found']);
        $stmt->close();
        $conn->close();
        exit();
    }
    
    // Return success message
    echo json_encode(['success' => true, 'message' => 'Riddle deleted successfully']);
    
    $stmt->close();
    $conn->close();
    exit();
}

// Handle invalid request methods
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);