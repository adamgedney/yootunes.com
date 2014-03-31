<?php

class SearchController extends BaseController {



	public function search($willYou)
	{
		$array = array(
			"I love pickle"=>true,
			"Pickle loves me?"=>'yes!',
			"Will you marry me?"=>'false');

		if($willYou == 'true'){

			$array = "Hooray!!!";

		}else{
			$array = "This sucks!";
		}

		return json_encode($array);
	}






	//================//
	//Internal Methods//
	//================//
	public function logSearch()
	{
		return "Testing route";
	}




	public function getYoutube(){

	}




	public function getGrooveshark(){

	}



}