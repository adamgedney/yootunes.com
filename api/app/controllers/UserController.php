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









	public function loginFacebook()
	{

		//Auth through facebook
		$login = Social::login('facebook');

	  	// $user = Social::facebook('user');
		// var_dump($login);
		// header('Access-Control-Allow-Origin: *');
		// return Response::json($login);

		// if(Social::check('facebook')){
  //     		 print_r( Social::facebook('/120500222/feed'));
  //     	}
		// return $login;
		return Redirect::to($login);
		// header("'Location:" . (string)$login . "'");
		// echo urldecode($login);
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