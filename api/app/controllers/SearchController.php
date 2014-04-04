<?php


class SearchController extends BaseController {




	public function search($q){

		//===================//
		//Begin search cascade
		//===================//
		//1. Search Query
		//2. Check local Tinysong table
		//	 2a. –If no results, Get & add Tiny results to local DB. Move to step 3
		//	 2b. –If results already exist local, move to step 3
		//3. Get local Tinysong results
		//4. Check local YouTube results
		//	 4a. –If no results, Get & add YT results to local DB. Move to step 5
		//	 4b. –If results already exist local, move to step 5
		//5. Get local YouTube results
		//6. Merge data & store in local songs table
		//7. Return to client the youtube results on query term, with merged data, from songs table

		$getLocalTinySong;
		$getLocalYouTube;


		//===============================================//
		//Step 2. –Query local Tinysong table
		//===============================================//
		$localTinyExists = TinySong::where('query', '=', $q)->count();


		//Step 2a. –Local tinysong NO RESULTS
		if($localTinyExists == 0){

			//Get & add tinysong results to local DB
			$getTinySong = json_decode($this->getTinySong($q));

			//Step 3. –get local tinysong results
			$getLocalTinySong = $this->getLocalTinySong($q);

		}else{//Step 2b. –Local tinysong RESULTS ALREADY EXIST

			//Step 3. –get local tinysong results
			$getLocalTinySong = $this->getLocalTinySong($q);
		}




		//===============================================//
		//Step 4. –Check local Youtube table
		//===============================================//
		$localYouTubeExists = YouTube::where('query', '=', $q)->count();


		//Step 4a. –localYouTube NO RESULTS
		if($localYouTubeExists == 0){

			//Get & add youtube results to local DB
			$getYouTube = json_decode($this->getYouTube($q));

			//Step 5. –get local youtube results
			$getLocalYouTube = $this->getLocalYouTube($q);

		}else{//Step 4b. –Local youtube RESULTS ALREADY EXIST

			//Step 5. –get local youtube results
			$getLocalYouTube = $this->getLocalYouTube($q);

		}




		//===============================================//
		//Step 6. –Merge TinySong & youTube data into songs table
		//===============================================//

		$merge = $this->mergeData($getLocalTinySong, $getLocalYouTube);



		//===============================================//
		//Step 7. –Return query results to client via song table
		//===============================================//

		//Instantiate Songs Model
		// $songsModel = new Songs();

		// return $return;






	}












	//================//
	//Internal Methods//
	//================//



	// public function mergeData($getLocalTinySong, $getLocalYouTube){

	// 	//Loop through each youtube video & passinto assumptions engine
	// 	foreach(json_decode($getLocalYouTube) as $youtubeItem){

	// 		$this->assumptionsEngine($getLocalTinySong, $youtubeItem);
	// 	}
	// }

	//alternate loop
	public function mergeData($getLocalTinySong, $getLocalYouTube){

		//Loop through each youtube video & passinto assumptions engine
		foreach(json_decode($getLocalTinySong) as $tinyItem){

			$this->assumptionsEngine($getLocalYouTube, $tinyItem);
		}
	}


	//ALTERNATE Primary data analyzer & merger.
	public function assumptionsEngine($getLocalYouTube, $tinyItem){


		//Loop through all tinysong results to see if the youtube
		//result matches any of the track metadata
		foreach($getLocalYouTube as $songItem){

			$songFilter = $tinyItem->song_name;
			$artistFilter = $tinyItem->artist_name;
			$albumFilter = $tinyItem->album_name;

			$song = '';
			$artist = '';
			$album = '';

			//Failsafe to ensure strpos doesn't crash
			//when no album name present
			if($albumFilter == ""){
				$albumFilter = "http://adamgedney.com";
			}



			//=======================Assumptions Engine=======================//
			//Searches title and description of YouTbe result for additional metadata.
			//Song titles and artists are not searched by description as
			//Track lists could exist in descriptions. Album seems to be a
			//safe search in description.
			$songCheckTitle = strpos(strtolower($songItem->title), strtolower($songFilter));
			$artistCheckTitle = strpos(strtolower($songItem->title), strtolower($artistFilter));
			$artistCheckDesc = strpos(strtolower($songItem->description), strtolower($artistFilter));
			$albumCheckTitle = strpos(strtolower($songItem->title), strtolower($albumFilter));
			$albumCheckDesc = strpos(strtolower($songItem->description), strtolower($albumFilter));





			//**Song names check requires more to prove this result is the correct song
			//Search YouTube TITLE for SONG name & ARTIST name
			if($songCheckTitle !== false && $artistCheckTitle !== false){
				$song = $songFilter;
				$artist = $artistFilter;
			}

			//Search YouTube TITLE & DESC for SONG name & ARTIST name
			if($songCheckTitle !== false && $artistCheckDesc !== false){
				$song = $songFilter;
				$artist = $artistFilter;
			}

			//Search YouTube TITLE for SONG name string
			if($songCheckTitle !== false){
				$song = $songFilter;
			}


			//Search YouTube TITLE for ARTIST name string
			if($artistCheckTitle !== false){
				$artist = $artistFilter;
			}


			//Search YouTube DESC for ARTIST name string
			if($artistCheckDesc !== false){
				$artist = $artistFilter;
			}


			//Search YouTube TITLE or DESC for ALBUM name string
			if($albumCheckTitle !== false || $albumCheckDesc !== false){
				$album = $albumFilter;
			}





			//INstantiate Songs Model
			$songsModel = new Songs();

			//Insert merged data into DB if it doesn't already exist
			$songsModel->create(array(
				'query' => $songItem->query,
				'song_title' => $song,
				'youtube_title' => $songItem->title,
				'artist' => $artist,
				'album' => $album,
				'genre' => '',
				'description' => $songItem->description,
				'youtube_id' => $songItem->video_id,
				'img_default' => $songItem->img_default,
				'img_medium' => $songItem->img_medium,
				'img_high' => $songItem->img_high,
				'length' => '',
				'youtube_results_id' => $songItem->id
			));
		}//foreach
	}





	// //Primary data analyzer & merger.
	// public function assumptionsEngine($getLocalTinySong, $youtubeItem){


	// 	//Loop through all tinysong results to see if the youtube
	// 	//result matches any of the track metadata
	// 	foreach($getLocalTinySong as $songItem){

	// 		$songFilter = $songItem->song_name;
	// 		$artistFilter = $songItem->artist_name;
	// 		$albumFilter = $songItem->album_name;

	// 		$song = '';
	// 		$artist = '';
	// 		$album = '';

	// 		//Failsafe to ensure strpos doesn't crash
	// 		//when no album name present
	// 		if($albumFilter == ""){
	// 			$albumFilter = "http://adamgedney.com";
	// 		}



	// 		//=======================Assumptions Engine=======================//
	// 		//Searches title and description of YouTbe result for additional metadata.
	// 		//Song titles and artists are not searched by description as
	// 		//Track lists could exist in descriptions. Album seems to be a
	// 		//safe search in description.
	// 		$songCheckTitle = strpos(strtolower($youtubeItem->title), strtolower($songFilter));
	// 		$artistCheckTitle = strpos(strtolower($youtubeItem->title), strtolower($artistFilter));
	// 		$artistCheckDesc = strpos(strtolower($youtubeItem->description), strtolower($artistFilter));
	// 		$albumCheckTitle = strpos(strtolower($youtubeItem->title), strtolower($albumFilter));
	// 		$albumCheckDesc = strpos(strtolower($youtubeItem->description), strtolower($albumFilter));





	// 		//**Song names check requires more to prove this result is the correct song
	// 		//Search YouTube TITLE for SONG name & ARTIST name
	// 		if($songCheckTitle !== false && $artistCheckTitle !== false){
	// 			$song = $songFilter;
	// 			$artist = $artistFilter;
	// 		}

	// 		//Search YouTube TITLE & DESC for SONG name & ARTIST name
	// 		if($songCheckTitle !== false && $artistCheckDesc !== false){
	// 			$song = $songFilter;
	// 			$artist = $artistFilter;
	// 		}

	// 		//Search YouTube TITLE for SONG name string
	// 		if($songCheckTitle !== false){
	// 			$song = $songFilter;
	// 		}


	// 		//Search YouTube TITLE for ARTIST name string
	// 		if($artistCheckTitle !== false){
	// 			$artist = $artistFilter;
	// 		}


	// 		//Search YouTube DESC for ARTIST name string
	// 		if($artistCheckDesc !== false){
	// 			$artist = $artistFilter;
	// 		}


	// 		//Search YouTube TITLE or DESC for ALBUM name string
	// 		if($albumCheckTitle !== false || $albumCheckDesc !== false){
	// 			$album = $albumFilter;
	// 		}





	// 		//INstantiate Songs Model
	// 		$songsModel = new Songs();

	// 		//Insert merged data into DB if it doesn't already exist
	// 		$songsModel->create(array(
	// 			'query' => $youtubeItem->query,
	// 			'song_title' => $song,
	// 			'youtube_title' => $youtubeItem->title,
	// 			'artist' => $artist,
	// 			'album' => $album,
	// 			'genre' => '',
	// 			'description' => $youtubeItem->description,
	// 			'youtube_id' => $youtubeItem->video_id,
	// 			'img_default' => $youtubeItem->img_default,
	// 			'img_medium' => $youtubeItem->img_medium,
	// 			'img_high' => $youtubeItem->img_high,
	// 			'length' => '',
	// 			'youtube_results_id' => $youtubeItem->id
	// 		));
	// 	}//foreach
	// }











	public function getLocalTinySong($query){

		$tinyModel = new TinySong();

		//Calls Model to search DB for query
		$results = $tinyModel->where('query', '=', $query)->get();

		return $results;
	}




	public function getLocalYouTube($query){

		$youtubeModel = new YouTube();

		//Calls Model to search DB for query
		$results = $youtubeModel->where('query', '=', $query)->get();

		return $results;
	}












	//Fetches results from YouTube Data API & stores in
	//database if they don't already exist
	public function getYoutube($query){
		//NOTE: using this -https://code.google.com/p/google-api-php-client/wiki/GettingStarted

  		$YOUTUBE_API_KEY = 'AIzaSyCukRpGoGeXcvHKEEPRLKg7-toFMhtkeYk';
  		$MAX_RESULTS = 50;

  		//Format string to strip spaces and add "+"
		$queryExplode = explode(" ", $query);
		$queryImplode = implode("+", $queryExplode);

		//API url
		$youtubeQuery = 'https://www.googleapis.com/youtube/v3/search?&maxResults=' . (string)$MAX_RESULTS . '&part=snippet&q=' . $queryImplode . '&regionCode=US&type=video&videoCategoryId=10&fields=items(etag,id(videoId),snippet(title,description,thumbnails))&key=' . (string)$YOUTUBE_API_KEY;

		//returns the snippet and statistics part with only the id, desc, title, thumbnails fields
		$youtubeResponse = file_get_contents($youtubeQuery);



		//Insert query results into database for future searches
		$youtubeModel = new YouTube();

		foreach(json_decode($youtubeResponse) as $result){

			$youtubeModel->firstOrCreate(array(
				'query' => $query,
				'etag' => $result[0]->etag,
				'video_id' => $result[0]->id->videoId,
				'title' => $result[0]->snippet->title,
				'description' => $result[0]->snippet->description,
				'img_default' => $result[0]->snippet->thumbnails->default->url,
				'img_medium' => $result[0]->snippet->thumbnails->medium->url,
				'img_high' => $result[0]->snippet->thumbnails->high->url
			));
		}
	}











	//Fetches results from TinySong API & stores in
	//database if they don't already exist
	public function getTinySong($query){

		//Grooveshark API key
		$TINY_API_KEY = '6ab1c1e7fdf25492f84948a6514238dc';
		$LIMIT = 32;

		//Format string to strip spaces and add "+"
		$queryExplode = explode(" ", $query);
		$queryImplode = implode("+", $queryExplode);

		//API Url
		$tinyQuery = "http://tinysong.com/s/" . $queryImplode . "?format=json&limit=" . (string)$LIMIT . "&key=" . (string)$TINY_API_KEY;

		//Query API -Returns JSON
		$tinyResponse = file_get_contents($tinyQuery);




		//Insert query results into database for future searches
		$tinyModel = new TinySong();

		foreach(json_decode($tinyResponse) as $result){

			$tinyModel->firstOrCreate(array(
				'query' => $query,
				'url' => $result->Url,
				'song_id' => $result->SongID,
				'song_name' => $result->SongName,
				'artist_id' => $result->ArtistID,
				'artist_name' => $result->ArtistName,
				'album_id' => $result->AlbumID,
				'album_name' => $result->AlbumName
			));
		}
	}






























}