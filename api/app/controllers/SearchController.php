<?php

class SearchController extends BaseController {



	public function search()
	{
		$array = array(
			"success"=>true,
			"really?"=>'yes!');

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