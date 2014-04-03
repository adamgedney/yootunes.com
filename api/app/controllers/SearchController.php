<?php


class SearchController extends BaseController {




	public function search($q)
	{


		//===================//
		//Begin search cascade
		//===================//
		//1. Search Query
		//2. Check local Tinysong table
		//	 –If no results, Get & add Tiny results to local DB. Move to step 3
		//	 –If results already exist local, move to step 3
		//3. Get local Tinysong results
		//4. Check local YouTube results
		//	 –If no results, Get & add YT results to local DB. Move to step 5
		//	 –If results already exist local, move to step 5
		//5. Get local YouTube results
		//6. Merge data & store in local songs table
		//7. Return to client the youtube results on query term, with merged data, from songs table


		//Query local Tinysong table
		$localTinyExists = TinySong::where('query', '=', $q)->count();


		//Local tinysong NO RESULTS
		if($localTinyExists == 0){

			//Get & add tinysong results to local DB
			$response = json_decode($this->getTinySong($q));
			return $response;

		//Local tinysong RESULTS ALREADY EXIST
		}else{

			return $localTinyExists;

		}
	}





//=======*******Notes for tomorrow: Check youtube data population events.
	//Make sure all data is hitting song insert loop in correct format.
	//May need to fire an event picked up by merge data loop so insert into library is properly formatted.






	//================//
	//Internal Methods//
	//================//

	//Event handler for tinysong results store complete
	// public function localTinyExists($query)
	// {
	// 	//Step 2. Run again to pull data
	// 	$queryLocalTinySong = $this->queryLocalTinySong($query);

	// 	//Step 3. –Fetches youtube results based on ORIGINAL QUERY –passes tinysong for later merge
	// 	$youtubeResults = $this->queryLocalYouTube($query, $queryLocalTinySong);
	// }







	// //Event handler for youtube results store complete
	// public function localYouTubeExists($query, $queryLocalTinySong)
	// {

	// 	//Step 4. –Fetches youtube results based on ORIGINAL QUERY –passes tinysong for later merge
	// 	$youtubeResults = $this->queryLocalYouTube($query, $queryLocalTinySong);

	// 	var_dump($youtubeResults);
	// }









	public function mergeData(){

		// //*******************************************run only if song didn't already exist in song table

		// foreach(json_decode($youtubeResults) as $yt){
		// 	$insert = Library::setSong($queryLocalTinySong, $yt);
		// }

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





	public function queryLocalYouTube($query, $queryLocalTinySong){

		//Calls Model to search DB for query
		$results = YouTube::getResults($query);

		//If local YouTube is empty
		if(empty($results)){

			//Get & add yt results to local store
			$ytResult = $this->getYoutube($query, $queryLocalTinySong);

		}else{

			//Tells the Search Controller when step 4 is ok
			Event::fire('youtube.saved', array($query, $queryLocalTinySong));
		}
	}











	public function getYoutube($query, $queryLocalTinySong){
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
		$inserted = YouTube::setResults($query, $youtubeResponse, $queryLocalTinySong);

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
		// $tinyModel = TinySong::setResults($query, $tinyResponse);
		$tinyModel = new TinySong();

		foreach(json_decode($tinyResponse) as $result){
			$tinyModel->firstOrCreate(array('query' => $query, 'url' => $result->Url, 'song_id' => $result->SongID, 'song_name' => $result->SongName, 'artist_id' => $result->ArtistID, 'artist_name' => $result->ArtistName, 'album_id' => $result->AlbumID, 'album_name' => $result->AlbumName));
		}

		return $tinyModel;

		// //Error handling for insert
		// if($inserted){

		// 	return $tinyResponse;

		// }else{

		// 	$error = array('error'=>'failed to insert tinysong results into database');
		// 	return json_encode($error);
		// }
	}






























}