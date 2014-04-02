<?php


class SearchController extends BaseController {



	public function search($q)
	{

		//===================//
		//Begin search cascade
		//===================//

		//First checks the tinysong table in my DB for query.
		//If found, display results, else hit the tinysong api & store result
		$queryLocalTinySong = $this->queryLocalTinySong($q);




		//Local tinysong NULL
		if($queryLocalTinySong == 'null tinysong response'){

			//If this is the first time query has been run, hit API
			$response = json_decode($this->getTinySong($q));

			//Determines query type -song, artist, album
			$typedQuery = $this->checkTypeTinyAPI($q, $response);

			//Fetches youtube results based on refined query
			$youtubeResults = $this->fetchYouTube($typedQuery);

		//=========================//
		}else{//local tinysong !NULL
		//=========================//

			//Determines query type -song, artist, album
			$typedQuery = $this->checkTypeTinyDB($q, $queryLocalTinySong);

			//Fetches youtube results based on refined query
			$youtubeResults = $this->fetchYouTube($typedQuery['typedQuery']);

			//run only if song didn't already exist in song table
			foreach($youtubeResults as $yt){
				$insert = Library::setSong($queryLocalTinySong[0], $yt, $typedQuery['type']);
			}

		}

		return $typedQuery;
	}











	//================//
	//Internal Methods//
	//================//


	public function logSearch()
	{
		return "Testing route";
	}









	public function getYoutube($query){
		//NOTE: using this -https://code.google.com/p/google-api-php-client/wiki/GettingStarted



  		$YOUTUBE_API_KEY = 'AIzaSyCukRpGoGeXcvHKEEPRLKg7-toFMhtkeYk';
  		$MAX_RESULTS = 50;

  		//Format string to strip spaces and add "+"
		$queryExplode = explode(" ", $query);
		$queryImplode = implode("+", $queryExplode);

		$youtubeQuery = 'https://www.googleapis.com/youtube/v3/search?&maxResults=' . (string)$MAX_RESULTS . '&part=snippet&q=' . $queryImplode . '&regionCode=US&type=video&videoCategoryId=10&fields=items(etag,id(videoId),snippet(title,description,thumbnails))&key=' . (string)$YOUTUBE_API_KEY;

		//returns the snippet and statistics part with only the id, desc, title, thumbnails fields
		$youtubeResponse = file_get_contents($youtubeQuery);

		//Insert query results into database for future searches
		$inserted = YouTube::setResults($query, $youtubeResponse);

		//Error handling for insert
		if($inserted){
			return $youtubeResponse;

		}else{

			$error = array('error'=>'failed to insert youtube results into database');
			return json_encode($error);
		}

	}










	public function queryLocalYouTube($query){

		//Calls Model to search DB for query
		$results = YouTube::getResults($query);

		//Handle NULL result or return response
		if(empty($results)){
			$error = 'null youtube response';
			return $error;
		}else{
			return $results;
		}
	}










	public function getTinySong($query){

		//Grooveshark API key
		$TINY_API_KEY = '6ab1c1e7fdf25492f84948a6514238dc';

		//Format string to strip spaces and add "+"
		$queryExplode = explode(" ", $query);
		$queryImplode = implode("+", $queryExplode);

		//API Url
		$tinyQuery = "http://tinysong.com/s/" . $queryImplode . "?format=json&limit=32&key=" . (string)$TINY_API_KEY;

		//Query API -Returns JSON
		$tinyResponse = file_get_contents($tinyQuery);



		//Insert query results into database for future searches
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
			$error = 'null tinysong response';
			return $error;
		}else{
			return $results;
		}
	}









	public function checkTypeTinyDB($q, $response){

		$song = strtolower($response[0]->song_name);
		$artist = strtolower($response[0]->artist_name);
		$album = strtolower($response[0]->album_name);
		$artistSong = $artist . " " . $song;
		$songArtist = $song . " " . $artist;
		$artistAlbum = $artist . " " . $album;
		$songAlbum = $song . " " . $album;

		$query = strtolower($q);


		//If query was an artist name
		if($artist == $query){

			$typedQuery = $response[0]->artist_name;
			$type = "artist";

		//If query was an album title
		}else if($album == $query){

			$typedQuery = $response[0]->album_name;
			$type = "album";

		//If query was a song title
		}else if($song == $query){

			$typedQuery = $response[0]->song_name;
			$type = "song";

		}else if($artistSong == $query){

			$typedQuery = $response[0]->song_name;
			$type = "song";

		}else if($songArtist == $query){

			$typedQuery = $response[0]->song_name;
			$type = "song";

		}else if($artistAlbum == $query){

			$typedQuery = $response[0]->album_name;
			$type = "album";

		}else if($songAlbum == $query){

			$typedQuery = $response[0]->song_name;
			$type = "song";

		}else{//Failsafe assumes song title

			$typedQuery = $response[0]->song_name;
			$type = "song";
		}

		$return = array('typedQuery'=>$typedQuery, 'type'=>$type);

		return $return;
	}









	public function checkTypeTinyAPI($q, $response){

		$song = strtolower($response[0]->SongName);
		$artist = strtolower($response[0]->ArtistName);
		$album = strtolower($response[0]->AlbumName);
		$artistSong = $artist . " " . $song;
		$songArtist = $song . " " . $artist;
		$artistAlbum = $artist . " " . $album;
		$songAlbum = $song . " " . $album;

		$query = strtolower($q);


		//If query was an artist name
		if($artist == $query){

			$typedQuery = $response[0]->ArtistName;

		//If query was an album title
		}else if($album == $query){

			$typedQuery = $response[0]->AlbumName;

		//If query was a song title
		}else if($song == $query){

			$typedQuery = $response[0]->SongName;

		}else if($artistSong == $query){

			$typedQuery = $response[0]->SongName;

		}else if($songArtist == $query){

			$typedQuery = $response[0]->SongName;

		}else if($artistAlbum == $query){

			$typedQuery = $response[0]->AlbumName;

		}else if($songAlbum == $query){

			$typedQuery = $response[0]->SongName;

		}else{//Failsafe assumes song title

			$typedQuery = $response[0]->song_name;
		}

		return $typedQuery;
	}









	public function fetchYouTube($typedQuery){

		//First QUERY LOCAL YOUTUBE database store, then if query
		//found return results or fresh query
		$queryLocalYouTube = $this->queryLocalYouTube($typedQuery);

			//Check if in local youtube store
			if($queryLocalYouTube == 'null youtube response'){
				$ytResult = $this->getYoutube($typedQuery);

				return $ytResult;
			}else{
				$ytResult = $queryLocalYouTube;

				return $ytResult;
			}
	}





}