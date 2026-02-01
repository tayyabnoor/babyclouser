<?php
// SMTP Configuration
define('SMTP_HOST', 'server366.web-hosting.com');  // Removed https:// and port from host
define('SMTP_USERNAME', 'info@babyclouser.com');
define('SMTP_PASSWORD', '9T%S(,&4sQfT');
define('SMTP_SECURE', 'ssl');
define('SMTP_PORT', 465);

define('ADMIN_EMAIL', 'info@babyclouser.com');
define('SITE_NAME', 'BabyClouser');

// Check if PHPMailer is available
$phpmailer_available = false;
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require __DIR__ . '/vendor/autoload.php';
    $phpmailer_available = class_exists('PHPMailer\PHPMailer\PHPMailer');
}

// Function to send email
function sendEmail($to, $subject, $message, $from = null) {
    global $phpmailer_available;
    
    if ($from === null) {
        $from = ADMIN_EMAIL;
    }
    
    // Validate email addresses
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        error_log("Invalid recipient email address: $to");
        return false;
    }
    
    if (!filter_var($from, FILTER_VALIDATE_EMAIL)) {
        error_log("Invalid sender email address: $from");
        return false;
    }
    
    // Use PHPMailer if available, otherwise use PHP mail()
    if ($phpmailer_available) {
        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            
            // Server settings
            $mail->isSMTP();
            $mail->Host = SMTP_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = SMTP_USERNAME;
            $mail->Password = SMTP_PASSWORD;
            $mail->SMTPSecure = SMTP_SECURE;
            $mail->Port = SMTP_PORT;
            $mail->CharSet = 'UTF-8';
            
            // SMTP Options for better compatibility
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );
            
            // Timeout settings
            $mail->Timeout = 30;
            $mail->SMTPKeepAlive = false;
            
            // Enable verbose debug output (only to error log, not displayed)
            $mail->SMTPDebug = 0; // 0 = off, 2 = client messages, 4 = client and server messages
            
            // Recipients
            $mail->setFrom($from, SITE_NAME);
            $mail->addAddress($to);
            $mail->addReplyTo($from, SITE_NAME);
            
            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $message;
            // Add plain text version for better email client compatibility
            $mail->AltBody = strip_tags($message);
            
            $result = $mail->send();
            if ($result) {
                error_log("Email sent successfully to: $to");
                return true;
            } else {
                error_log("PHPMailer send() returned false for: $to");
                error_log("PHPMailer Error Info: {$mail->ErrorInfo}");
                // Fall through to PHP mail() fallback
            }
        } catch (PHPMailer\PHPMailer\Exception $e) {
            error_log("PHPMailer Exception: {$e->getMessage()}");
            error_log("PHPMailer Error Info: " . (isset($mail) ? $mail->ErrorInfo : 'Mail object not created'));
            // Fall through to PHP mail() fallback
        } catch (Exception $e) {
            error_log("General Exception in sendEmail: {$e->getMessage()}");
            // Fall through to PHP mail() fallback
        }
    }
    
    // Fallback to PHP native mail() function
    $headers = "From: " . SITE_NAME . " <$from>\r\n";
    $headers .= "Reply-To: $from\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    
    $result = @mail($to, $subject, $message, $headers);
    if ($result) {
        error_log("Email sent via PHP mail() to: $to");
    } else {
        $error = error_get_last();
        error_log("PHP mail() function failed to send email to: $to");
        if ($error) {
            error_log("Last error: " . $error['message']);
        }
    }
    return $result;
}
?>
