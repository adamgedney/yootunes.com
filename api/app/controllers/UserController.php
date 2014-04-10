<?php
header('Access-Control-Allow-Origin: *');

class UserController extends BaseController {


	public function newUser($email, $pw, $with){

		//Add new user to database
		$signup = User::insert(array(
			'email'				=>$email,
			'password'			=>$pw,
			'registered_with'	=>$with
		));



		//Fetch current user to begin building their acct
		$user = User::where('email', "=", $email)->get();
		$userId = $user[0]->id;



		//Create a new library for the user
		Library::insert(array('user_id'=>$userId));



		//Return object
		$obj = array(
			'response'	=>$signup,
			'userId'	=>$userId,
			'email'		=>$email
		);



		header('Access-Control-Allow-Origin: *');
		return Response::json($obj);
	}










	public function getUser($email, $pw)
	{


		//Fetch current user to begin building their acct
		$user = User::where('email', "=", $email)
					->where('password', "=", $pw)
					->where('deleted_at', '=', NULL)
					->get();

		$userId = $user[0]->id;


		//Return authentication value
		$success = false;

		if($userId !== "" || $userId !== NULL){
			$success = true;
		}


		//Return object
		$obj = array(
			'success'	=>$success,
			'userId'	=>$userId,
			'email'		=>$email
		);


		header('Access-Control-Allow-Origin: *');
		return Response::json($obj);
	}










	public function plusUser($name, $id, $gender){

		$signup;
		$userId;

		//Does user already exist?
		$exists = User::where('plus_id', '=', $id)->count();


			//If Plus user does NOT already exist
			if($exists === "0"){

				//Create new Plus user
				$signup = User::insert(array(
					'display_name'		=> $name,
					'plus_id'			=> $id,
					'gender'			=> $gender,
					'registered_with'	=> 'plus'
				));



				//Fetch current user to begin building their acct
				$user = User::where('plus_id', '=', $id)->get();
				$userId = $user[0]->id;



				//Create a new library for the user
				Library::insert(array('user_id'=>$userId));



			}else{//If Plus user DOES exist


				//return the user to client so user library/acct can be loaded
				$user = User::where('plus_id', '=', $id)->get();
				$userId = $user[0]->id;

			}


			//Build return object
			$obj = array(
				'response'	=> (empty($signup)) ? "User Exists" : $signup,
				'userId'	=> $userId
			);

		header('Access-Control-Allow-Origin: *');
		return Response::json($obj);
	}










	public function updateUser()
	{
		return "Testing route";
	}




	public function deleteUser()
	{
		return "Testing route";
	}










	public function forgotPassword($email)
	{

		$message;
		$userExists = User::where('email', '=', $email)->count();


		//If we have the user
		if($userExists !== "0"){

			//Get the user/user id
			$user = User::where('email', '=', $email)->get();
			$userId = $user[0]->id;



			//generate a "random" token for this request
			$token = md5(uniqid($userId, true));

			//Insert token into log for later verification of request
			$logToken = UserLog::insert(array(
				'user_id'		=>$userId,
				'reset_token'	=>$token
			));



			//Send the user an email with the token in url
			$mail = $this->sendEmail($email, $token);

			//Determine mail status
			if($mail){
				$message = "Email sent";
			}else{
				$message = "Email failed";
			}



		}else{//If user is not in system

			$message = "User null";
		}



		header('Access-Control-Allow-Origin: *');
		return Response::json($message);
	}









	public function resetPassword($userId, $password){

		$message;

		//update user table with new password
		$updateUser = User::where('id', '=', $userId)
							->update(array('password' => $password));


		//Handle fails
		if($updateUser){
			$message = "Password reset success";
		}else{
			$message = "Failed password reset";
		}



		header('Access-Control-Allow-Origin: *');
		return Response::json($message);
	}











	//Devices====================//
	public function newDevice()
	{
		return "Testing route";
	}




	public function getDevice()
	{
		return "Testing route";
	}




	public function getDevices()
	{
		return "Testing route";
	}




	public function deleteDevice()
	{
		return "Testing route";
	}








	public function checkResetToken($token){

		$message;
		$userId = '';

		//Check validity of token
		$tokenExists = UserLog::where('reset_token', '=', $token)->count();

		//Build message according to token validity
		if($tokenExists !== "0"){

			$message = "Token valid";

			//Get user id to append to response
			$userLog = UserLog::where('reset_token', '=', $token)->get();
			$userId = $userLog[0]->user_id;

		}else{

			$message = "Invalid token";
		}



		//build return object
		$obj = array(
			'message' => $message,
			'userId' => $userId);


		header('Access-Control-Allow-Origin: *');
		return Response::json($obj);
	}









	public function sendEmail($email, $token){

		$from 		= 'no-reply@yootunes.com';
		$support 	= 'support@yootunes.com';
		$link 		= 'http://localhost:9000/?reset=' . $token;

		//MAIL password reset email
		$header  = 'MIME-Version: 1.0' . "\r\n";
		$header .= "Reply-To: " . $from . "\r\n";
		$header .= "Return-Path: " . $from . "\r\n";
		$header .= 'From: Yootunes.com <' . $from . '>' . "\r\n";

		$to = $email;
		$subject = "Reset your YooTunes password";

		$message = "YooTunes received a request to reset your password. Please click on the link below to reset it. \r\n \r\n" .
		"(copy & paste it into your address bar if it's not clickable) \r\n \r\n" .
		"\r\n \r\n" .
		$link . "\r\n \r\n" .
		"If you feel you received this message in error, please email support at " . $support . " \r\n \r\n" .
		"Thanks! \r\n" .
		"YooTunes support";

		//send email
		$mail = mail($to,$subject,$message,$header);

		return $mail;
	}










}