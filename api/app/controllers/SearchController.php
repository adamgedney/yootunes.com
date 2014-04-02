<?php


class SearchController extends BaseController {



	public function search($q)
	{

		//First checks the tinysong table in my DB for query.
		//If found, display results, else hit the tinysong api & store result
		$queryLocalTinySong = $this->queryLocalTinySong($q);


		if($queryLocalTinySong == 'null response'){

			//Logic to check if search query was artist, album, or song title
			$response = json_decode($this->getTinySong($q));

			$type = $response;

			//Check if query was an artist name, album, or song
			//Query YOUTUBE on this refined TinySong data
			if(strtolower($response[0]->ArtistName) == $q){
				$type = $response[0]->ArtistName . "  artist";

				$ytResult = $this->getYoutube($type);

			}else if(strtolower($response[0]->AlbumName) == $q){
				$type = $response[0]->AlbumName . "  album";

				$ytResult = $this->getYoutube($type);

			}else if(strtolower($response[0]->SongName) == $q){
				$type = $response[0]->SongName . "  song";

				$ytResult = $this->getYoutube($type);
			}

			return $ytResult;

		}else{

			$response = $queryLocalTinySong;

			$type = $response;

			//Check if query was an artist name, album, or song
			//Query YOUTUBE on this refined TinySong data
			if(strtolower($response[0]->artist_name) == $q){
				$type = $response[0]->artist_name;

				$ytResult = $this->getYoutube($type);

			}else if(strtolower($response[0]->album_name) == $q){
				$type = $response[0]->album_name;

				$ytResult = $this->getYoutube($type);

			}else if(strtolower($response[0]->song_name) == $q){
				$type = $response[0]->song_name;

				$ytResult = $this->getYoutube($type);
			}

			return $ytResult;
			// return $response;
		}
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
			$error = 'null response';
			return $error;
		}else{
			return $results;
		}
	}





}