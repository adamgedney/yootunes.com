<?php
header('Access-Control-Allow-Origin: *');

class UserController extends BaseController {


	public function newUser($email, $pw, $with){

		//Add new user to database
		$signup = User::insert(array(
			'email'				=>$email,
			'password'			=>$pw,
			'registered_with'	=>$with,
			'is_deleted'		=>'false'
		));



		//Fetch current user to begin building their acct
		$user = User::where('email', "=", $email)
						->where('is_deleted', '=', 'false')
						->get();

		$userId = $user[0]->id;



		//Create a new library for the user
		Library::insert(array('user_id'=>$userId));

		//Create a new default device for the user
		$this->device($userId, 'default', '0');



		//Return object
		$obj = array(
			'response'	=>$signup,
			'userId'	=>$userId,
			'email'		=>$email
		);



		header('Access-Control-Allow-Origin: *');
		return Response::json($obj);
	}










	public function checkUser($email, $pw)
	{

		$userId 	= "";
		$success 	= false;
		$restorable = false;


		//First check to see if this user exists
		$user = User::where('email', "=", $email)
					->where('password', "=", $pw)
					->where('is_deleted', '=', 'false')
					->count();

		//If user exists, get id
		if($user !== "0"){

			//Fetch current user to begin building their acct
			$userObj = User::where('email', "=", $email)
					->where('password', "=", $pw)
					->where('is_deleted', '=', 'false')
					->get();

			$userId = $userObj[0]->id;
			$success = true;



		}else{//If user check failed, check to see if user is deleted


			$restoreUser = User::where('email', "=", $email)
					->where('password', "=", $pw)
					->where('is_deleted', '=', 'true')
					->count();

			//If user exists, but has previously deleted
			//account, announce user as restorable
			if($restoreUser !== "0"){
				$restorable = true;
			}
		}


		//Return object
		$obj = array(
			'success'	=>$success,
			'userId'	=>$userId,
			'email'		=>$email,
			'restorable'=> $restorable
		);


		header('Access-Control-Allow-Origin: *');
		return Response::json($obj);
	}









	public function getUser($userId){


		//Fetch current user
		$user = User::where('id', "=", $userId)
						->where('is_deleted', '=', 'false')
						->get();




		header('Access-Control-Allow-Origin: *');
		return Response::json($user);
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










	public function updateUser($id, $name, $email, $password)
	{


		//Fetch user data
		$user = User::where('id', '=', $id)->get();


			//Check for null values coming in from client.
			//If null replace with data already in DB
			if($name == "0"){
				$name = $user[0]->display_name;
			}

			if($password == "0"){
				$password = $user[0]->password;
			}

			if($email == "0"){
				$email = $user[0]->email;
			}


			//Update user data
			$updateUser = User::where('id', '=', $id)
								->update(array(
									'display_name'=>$name,
									'email'=>$email,
									'password'=>$password
								));




		header('Access-Control-Allow-Origin: *');
		return Response::json($updateUser);
	}











	public function deleteUser($userId){

		//Sets is_deleted column to true
		$deleteUser = User::where('id', '=', $userId)
							->update(array(
							'is_deleted'=>'true'));


		$obj = array(
			'deleteUser'=>$deleteUser,
			'userId'=>$userId);

		header('Access-Control-Allow-Origin: *');
		return Response::json($obj);
	}










	public function forgotPassword($email){

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









	public function restoreUser($email, $pw)
	{

		$userId = "";
		$message = "User account restored";

		//First check to see if this user exists as DELETED
		$user = User::where('email', "=", $email)
					->where('password', "=", $pw)
					->where('is_deleted', '=', 'true')
					->count();

		//If user exists, get id
		if($user !== "0"){

			//Update user status
			$userObj = User::where('email', "=", $email)
					->where('password', "=", $pw)
					->where('is_deleted', '=', 'true')
					->update(array('is_deleted'=>'false'));


			//Fetch userId for application reloading
			$userRow = User::where('email', "=", $email)
					->where('password', "=", $pw)
					->get();

			$userId = $userRow[0]->id;


		}else{//If user check failed

			$message = "User does not exist. Possible hack attempt.";
		}


		//Return object
		$obj = array(
			'message'	=>$message,
			'userId'	=>$userId,
			'email'     =>$email
		);


		header('Access-Control-Allow-Origin: *');
		return Response::json($obj);
	}











	//Devices====================//
	public function device($userId, $name, $currentDeviceId)
	{
		$insertDevice = NULL;
		$updateDevice = NULL;

		$newDeviceExists = Devices::where('user_id', '=', $userId)
									->where('name', '=', $name)
									->where('is_deleted', '!=', 'true')
									->count();

		$currentDeviceExists = Devices::where('user_id', '=', $userId)
									->where('name', '=', $currentDeviceId)
									->where('is_deleted', '!=', 'true')
									->count();


		//If this is a new device, insert
		if($newDeviceExists === 0 && $currentDeviceExists === 0){

			$insertDevice = Devices::insert(array(
				'user_id' 	=> $userId,
				'name'		=> $name,
				'is_deleted'=>'false'
			));

		//If new device name doesnt exist & the current device DOES EXIST
		//That means this is an update
		}else if($newDeviceExists === 0 && $currentDeviceExists !== 0){

			$updateDevice = Devices::where('user_id', '=', $userId)
									->where('name', '=', $currentDeviceId)
									->update(array(
										'name' => $name,
									));
		}



		$newDevice = Devices::where('user_id', '=', $userId)
							->where('name', '=', $name)
							->where('is_deleted', '!=', 'true')
							->get();



		//return object
		$obj = array(
			'insertDevice' 	=> $insertDevice,
			'updateDevice' 	=> $updateDevice,
			'newDeviceId'   => $newDevice[0]->id,
			'newDeviceName'	=> $newDevice[0]->name
		);

		header('Access-Control-Allow-Origin: *');
		return Response::json($obj);
	}












	public function getDevices($userId)
	{

		$devices = Devices::where('user_id', '=', $userId)
							->where('is_deleted', '=', 'false')
							->get();



		header('Access-Control-Allow-Origin: *');
		return Response::json($devices);
	}









	public function getDevice()
	{
		return "Testing route";
	}









	public function deleteDevice($deviceId)
	{

		$deleteDevice = Devices::where('id', '=', $deviceId)
							->update(array('is_deleted' => 'true'));


		header('Access-Control-Allow-Origin: *');
		return Response::json($deleteDevice);
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