<?php
header('Content-Type: application/json');
require_once 'config.php';

// Initialize response array
$response = ['success' => false, 'message' => ''];

try {
    // Get form data
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $subject = $_POST['subject'] ?? 'Contact Form Submission';
    $message = $_POST['message'] ?? '';
    
    // Basic validation
    if (empty($name) || empty($email) || empty($message)) {
        throw new Exception('All fields are required.');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Please enter a valid email address.');
    }
    
    // Prepare email content
    $emailContent = "
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>
        <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
        <p><strong>Subject:</strong> " . htmlspecialchars($subject) . "</p>
        <h3>Message:</h3>
        <p>" . nl2br(htmlspecialchars($message)) . "</p>";
    
    // Send email to admin
    $adminSubject = "New Contact Form: " . (empty($subject) ? 'New Message' : $subject);
    $adminSent = sendEmail(ADMIN_EMAIL, $adminSubject, $emailContent, $email);
    
    // Log email sending status
    error_log("Contact form - Admin email sent: " . ($adminSent ? 'true' : 'false'));
    
    // Send confirmation email to customer
    $customerSubject = "Thank you for contacting " . SITE_NAME;
    $customerMessage = "
        <p>Dear " . htmlspecialchars($name) . ",</p>
        <p>Thank you for contacting us. We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your Message:</strong></p>
        <blockquote>" . nl2br(htmlspecialchars($message)) . "</blockquote>
        <p>We appreciate your patience and will respond to your inquiry shortly.</p>
        <p>Best regards,<br>" . SITE_NAME . " Team</p>";
    
    $customerSent = sendEmail($email, $customerSubject, $customerMessage);
    
    // Log customer email status
    error_log("Contact form - Customer email sent: " . ($customerSent ? 'true' : 'false'));
    
    if ($adminSent && $customerSent) {
        $response['success'] = true;
        $response['message'] = 'Your message has been sent successfully!';
    } else {
        throw new Exception('Failed to send your message. Please try again later.');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
exit();
