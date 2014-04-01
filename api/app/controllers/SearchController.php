<?php

class SearchController extends BaseController {



	public function search($q)
	{

		//Build logic to check if search query was artist, album, or song title
		$response = json_decode($this->getGrooveshark($q));

		$r = $response;

		//Check if query was an artist name, album, or song
		if(strtolower($response[0]->ArtistName) == $q){
			$r = $response[0]->ArtistName . "  artist";

		}else if(strtolower($response[0]->AlbumName) == $q){
			$r = $response[0]->AlbumName . "  album";

		}else if(strtolower($response[0]->SongName) == $q){
			$r = $response[0]->SongName . "  song";
		}

		// return json_encode($response);
		return $r;
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




	public function getGrooveshark($query){

		//Grooveshark API key
		$tinyAPIKey = '6ab1c1e7fdf25492f84948a6514238dc';

		//Format string to strip spaces and add "+"
		$queryExplode = explode(" ", $query);
		$queryImplode = implode("+", $queryExplode);

		//API Url
		$tinyQuery = "http://tinysong.com/s/" . $queryImplode . "?format=json&limit=30&key=" . (string)$tinyAPIKey;

		//Query API -Returns JSON
		$tinyResponse = file_get_contents($tinyQuery);





		return $tinyResponse;

	}



}