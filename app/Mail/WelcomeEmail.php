<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $password;

    public function __construct($user, $password)
    {
        $this->user = $user;
        $this->password = $password;
    }

    public function build()
    {
        return $this->subject('Welcome to Our Platform')
                    ->html("
                        <h1>Welcome, {$this->user->name}!</h1>
                        <p>Your account has been created successfully.</p>
                        <p><strong>Email:</strong> {$this->user->email}</p>
                        <p><strong>Password:</strong> {$this->password}</p>
                        <p>Please log in and change your password for security.</p>
                    ");
    }
}