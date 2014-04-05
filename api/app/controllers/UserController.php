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










	public function getUser()
	{
		return "get user";
	}




	public function getUsers()
	{
		return "get users";
	}




	public function updateUser()
	{
		return "Testing route";
	}




	public function deleteUser()
	{
		return "Testing route";
	}




	public function resetUserPassword()
	{
		return "Testing route";
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










}