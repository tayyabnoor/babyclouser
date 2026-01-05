<?php
// SMTP Configuration
define('SMTP_HOST', 'server366.web-hosting.com');  // Removed https:// and port from host
define('SMTP_USERNAME', 'info@babyclouser.com');
define('SMTP_PASSWORD', '9T%S(,&4sQfT');
define('SMTP_SECURE', 'ssl');
define('SMTP_PORT', 465);

define('ADMIN_EMAIL', 'info@babyclouser.com');
define('SITE_NAME', 'BabyClouser');

// Include PHPMailer
define('PHPMailerAutoload', true);
require 'vendor/autoload.php';

// Function to send email
function sendEmail($to, $subject, $message, $from = null) {
    if ($from === null) {
        $from = ADMIN_EMAIL;
    }
    
    $headers = "From: " . SITE_NAME . " <$from>\r\n";
    $headers .= "Reply-To: $from\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    // Use PHPMailer for better email delivery
    require 'vendor/autoload.php';
    
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_SECURE;
        $mail->Port = SMTP_PORT;
        
        // Recipients
        $mail->setFrom($from, SITE_NAME);
        $mail->addAddress($to);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $message;
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}
?>
