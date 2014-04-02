<?php

class SearchController extends BaseController {



	public function search($q)
	{

		//First checks the tinysong table in my DB for query.
		//If found, display results, else hit the tinysong api & store result
		// $queryLocalTinySong = $this->queryLocalTinySong($q);

		// if($queryLocalTinySong == 'null response'){

		// 	//Logic to check if search query was artist, album, or song title
		// 	$response = json_decode($this->getGrooveshark($q));

		// 	$what = $response;

		// 	//Check if query was an artist name, album, or song
		// 	if(strtolower($response[0]->ArtistName) == $q){
		// 		$what = $response[0]->ArtistName . "  artist";

		// 	}else if(strtolower($response[0]->AlbumName) == $q){
		// 		$what = $response[0]->AlbumName . "  album";

		// 	}else if(strtolower($response[0]->SongName) == $q){
		// 		$what = $response[0]->SongName . "  song";
		// 	}

		// 	return $response;

		// }else{

		// 	return $queryLocalTinySong;
		// }
		$getYoutube = $this->getYoutube();
		return $getYoutube;
	}






	//================//
	//Internal Methods//
	//================//
	public function logSearch()
	{
		return "Testing route";
	}




	public function getYoutube(){

		$youtubeAPIKey = 'AIzaSyCukRpGoGeXcvHKEEPRLKg7-toFMhtkeYk';

		//returns the snippet and statistics part with only the id, desc, title, thumbnails fields
		$youtubeResponse = file_get_contents('https://www.googleapis.com/youtube/v3/search?q=ledzeppelin&key=' . (string)$youtubeAPIKey . '&fields=items(id,snippet(title,categoryId,description,thumbnails),statistics)&part=snippet,contentDetails');

		return $youtubeResponse;

	}




	public function getGrooveshark($query){

		//Grooveshark API key
		$tinyAPIKey = '6ab1c1e7fdf25492f84948a6514238dc';

		//Format string to strip spaces and add "+"
		$queryExplode = explode(" ", $query);
		$queryImplode = implode("+", $queryExplode);

		//API Url
		$tinyQuery = "http://tinysong.com/s/" . $queryImplode . "?format=json&limit=32&key=" . (string)$tinyAPIKey;

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
		if(empty($results)){
			$error = 'null response';
			return $error;
		}else{
			return $results;
		}
	}





}