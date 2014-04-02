<?php

class SearchController extends BaseController {



	public function search($q)
	{

		//First checks the tinysong table in my DB for query.
		//If found, display results, else hit the tinysong api & store result
		$queryLocalTinySong = $this->queryLocalTinySong($q);

		if($queryLocalTinySong->response == 'null'){

			//Logic to check if search query was artist, album, or song title
			$response = json_decode($this->getGrooveshark($q));

			$what = $response;

			//Check if query was an artist name, album, or song
			if(strtolower($response[0]->ArtistName) == $q){
				$what = $response[0]->ArtistName . "  artist";

			}else if(strtolower($response[0]->AlbumName) == $q){
				$what = $response[0]->AlbumName . "  album";

			}else if(strtolower($response[0]->SongName) == $q){
				$what = $response[0]->SongName . "  song";
			}

			return $response;

		}else{
			return $queryLocalTinySong;
		}
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
		$tinyQuery = "http://tinysong.com/s/" . $queryImplode . "?format=json&key=" . (string)$tinyAPIKey;

		//Query API -Returns JSON
		$tinyResponse = file_get_contents($tinyQuery);



		//Insert query results into database for future searches
		//$query, $url, $songId, $songName, $artistId, $artistName, $albumId, $albumName
		$inserted = TinySong::setResults($query, $tinyResponse);


		//Error handling for insert
		if($inserted){
			return $tinyResponse;

		}else{

			$error = array('error'=>'failed to insert tinysong results into database');
			return json_encode($error);
		}




	}




	public function queryLocalTinySong($query){

		//Calls Model to search DB for query
		$results = TinySong::getResults($query);

		//Handle NULL result or return response
		if($results != NULL){
			return $results;
		}else{
			$error = array('response'=>'null');
			return json_encode($error);
		}
	}





}