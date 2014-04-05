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


		$getLocalItunes;
		$getLocalYouTube;


		//===============================================//
		//Step 2. –Query local Itunes table
		//===============================================//

		$localItunesExists = Itunes::where('query', '=', $q)->count();



		//Step 2a. –Local Itunes NO RESULTS
		if($localItunesExists == "0"){

			//Get & add Itunes results to local DB
			$getItunes = $this->getItunes($q);

			//Step 3. –get local Itunes results
			$getLocalItunes = $this->getLocalItunes($q);

		}else{//Step 2b. –Local Itunes RESULTS ALREADY EXIST

			//Step 3. –get local Itunes results
			$getLocalItunes = $this->getLocalItunes($q);

		}




		//===============================================//
		//Step 4. –Check local Youtube table
		//===============================================//
		$localYouTubeExists = YouTube::where('query', '=', $q)->count();


		//Step 4a. –localYouTube NO RESULTS
		if($localYouTubeExists == "0"){

			//Get & add youtube results to local DB
			$this->getYouTube($q);

			//Step 5. –get local youtube results
			$getLocalYouTube = $this->getLocalYouTube($q);


		}else{//Step 4b. –Local youtube RESULTS ALREADY EXIST

			//Step 5. –get local youtube results
			$getLocalYouTube = $this->getLocalYouTube($q);

		}





		//===============================================//
		//Step 6. –Merge TinySong & youTube data into songs table
		//===============================================//
		//If we have itunes data from any source, but not youtube, then merge
		if($localItunesExists == "0" || $localItunesExists !== "0"){

			if($localYouTubeExists == "0"){

				$this->mergeData($getLocalItunes, $getLocalYouTube);
			}
		}

		//If we have youtube data from any source, but not itunes, then merge
		if($localYouTubeExists == "0" || $localYouTubeExists !== "0"){

			if($localItunesExists == "0"){

				$this->mergeData($getLocalItunes, $getLocalYouTube);
			}
		}






		//===============================================//
		//Step 7. –Return query results to client via song table
		//===============================================//

		$getSongs = $this->getSongs($q);



		header('Access-Control-Allow-Origin: *');
		return Response::json($getSongs);
	}//search



//*********************** NOTE: May need to switch looping order.***********************//
				//If no itunes data found, i still want youtube video
//**************************************************************************************//









	//========================================================================//
	//Internal Methods========================================================//
	//========================================================================//


	public function mergeData($getLocalItunes, $getLocalYouTube){

		//Loop through each TINYSONG RESULT & passinto assumptions engine
		foreach(json_decode($getLocalItunes) as $itunesItem){

			$this->assumptionsEngine($getLocalYouTube, $itunesItem);
		}
	}











	//Primary data analyzer & merger.
	public function assumptionsEngine($getLocalYouTube, $itunesItem){

		//Loop through all YOUTUBE RESULTS
		foreach($getLocalYouTube as $songItem){

			$songFilter 	= $itunesItem->track_name;
			$artistFilter 	= $itunesItem->artist_name;
			$albumFilter 	= $itunesItem->collection_name;
			$genreFilter 	= $itunesItem->primary_genre;

			$song 	= ' ';
			$artist = ' ';
			$album 	= ' ';
			$genre 	= ' ';
			$length = ' ';


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
			$songCheckTitle 	= strpos(strtolower($songItem->title), strtolower($songFilter));
			$songCheckDesc 		= strpos(strtolower($songItem->description), strtolower($songFilter));
			$artistCheckTitle 	= strpos(strtolower($songItem->title), strtolower($artistFilter));
			$artistCheckDesc 	= strpos(strtolower($songItem->description), strtolower($artistFilter));
			$albumCheckTitle 	= strpos(strtolower($songItem->title), strtolower($albumFilter));
			$albumCheckDesc 	= strpos(strtolower($songItem->description), strtolower($albumFilter));


			//==========================================//
			//Song Assumptions
			//==========================================//

			//Search YouTube TITLE for SONG name & ARTIST name
			if($songCheckTitle !== false && $artistCheckTitle !== false){
				$song 	= $songFilter;
				$artist = $artistFilter;
				//Assumes genre
				$genre 	= $genreFilter;
			}

			//Search YouTube TITLE for SONG name & ALBUM name
			if($songCheckTitle !== false && $albumCheckTitle !== false){
				$song 	= $songFilter;
				$album 	= $albumFilter;
				//Assumes genre
				$genre 	= $genreFilter;
			}

			//Search YouTube DESC for SONG name & ARTIST name
			if($songCheckDesc !== false && $artistCheckDesc !== false){
				$song 	= $songFilter;
				$artist = $artistFilter;
				//Assumes genre
				$genre 	= $genreFilter;
			}

			//Search YouTube DESC for SONG name & ALBUM name
			if($songCheckDesc !== false && $albumCheckDesc !== false){
				$song 	= $songFilter;
				$album 	= $albumFilter;
				//Assumes genre
				$genre 	= $genreFilter;
			}

			//Search YouTube TITLE for SONG name & DESC for ARTIST name
			if($songCheckTitle !== false && $artistCheckDesc !== false){
				$song 	= $songFilter;
				$artist = $artistFilter;
				//Assumes genre
				$genre 	= $genreFilter;
			}

			//Search YouTube TITLE for SONG name & DESC for ALBUM name
			if($songCheckTitle !== false && $albumCheckDesc !== false){
				$song 	= $songFilter;
				$album 	= $albumFilter;
				//Assumes genre
				$genre 	= $genreFilter;
			}



			//==========================================//
			//Artist Assumptions
			//==========================================//

			//Search YouTube TITLE for ARTIST name string
			if($artistCheckTitle !== false){
				$artist = $artistFilter;
				//Assumes genre
				$genre 	= $genreFilter;
			}

			//Search YouTube DESC for ARTIST name string
			if($artistCheckDesc !== false){
				$artist = $artistFilter;
				//Assumes genre
				$genre 	= $genreFilter;
			}




			//==========================================//
			//Album Assumptions
			//==========================================//

			//Search YouTube TITLE for ALBUM name string
			if($albumCheckTitle !== false){
				$album = $albumFilter;
				//Assumes genre
				$genre 	= $genreFilter;
			}

			//Search YouTube DESC for ALBUM name string
			if($albumCheckDesc !== false){
				$album = $albumFilter;
				//Assumes genre
				$genre 	= $genreFilter;
			}







			//==========================================//
			//Merge & Insert Song
			//==========================================//

			//Check for youtube_id in DB
			$youtubeIdExists = Songs::where('youtube_id', '=', $songItem->video_id)->get();

			//Convert Model results to array
			$thisVideo = json_decode($youtubeIdExists, true);

			//If video has been inserted, update its info where available
			if(isset($thisVideo[0])){

				//Update SONG TITLE
				if($thisVideo[0]["song_title"] == " " || $thisVideo[0]["song_title"] == NULL){

					Songs::where('youtube_id', '=',$songItem->video_id)
					->update(array('song_title' => $song));
				}

				//Update ARTIST NAME
				if($thisVideo[0]["artist"] == " " || $thisVideo[0]["artist"] == NULL){

					Songs::where('youtube_id', '=',$songItem->video_id)
					->update(array('artist' => $artist));
				}

				//Update ALBUM NAME
				if($thisVideo[0]["album"] == " " || $thisVideo[0]["album"] == NULL){

					Songs::where('youtube_id', '=',$songItem->video_id)
					->update(array('album' => $album));
				}

				//Update GENRE
				if($thisVideo[0]["genre"] == " " || $thisVideo[0]["genre"] == NULL){

					Songs::where('youtube_id', '=',$songItem->video_id)
					->update(array('genre' => $genre));
				}


			}else{


				//Insert
				Songs::insert(array(
					'query' 			=> $songItem->query,
					'song_title' 		=> $song,
					'youtube_title' 	=> $songItem->title,
					'artist' 			=> $artist,
					'album' 			=> $album,
					'genre' 			=> $genre,
					'description' 		=> $songItem->description,
					'youtube_id' 		=> $songItem->video_id,
					'img_default' 		=> $songItem->img_default,
					'img_medium' 		=> $songItem->img_medium,
					'img_high' 			=> $songItem->img_high,
					'length' 			=> $length,
					'youtube_results_id'=> $songItem->id
				));
			}
		}//foreach
	}











	public function getLocalItunes($query){

		//Calls Model to search DB for query
		$results = Itunes::where('query', '=', $query)->get();

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
		$youtubeResponse = json_decode($youtubeResponse, true);

		//Note: The below var_dump is the proper syntax for traversing results
		//var_dump($youtubeResponse['items'][0]['snippet']['title']);



		//Insert query results into database for future searches
		$youtubeModel = new YouTube();

		foreach($youtubeResponse['items'] as $key=>$response){

			$youtubeModel->firstOrCreate(array(
				'query' 		=> $query,
				'etag' 			=> $response['etag'],
				'video_id' 		=> $response['id']['videoId'],
				'title' 		=> $response['snippet']['title'],
				'description' 	=> $response['snippet']['description'],
				'img_default' 	=> $response['snippet']['thumbnails']['default']['url'],
				'img_medium' 	=> $response['snippet']['thumbnails']['medium']['url'],
				'img_high' 		=> $response['snippet']['thumbnails']['high']['url']
			));
		}
	}











	//Fetches results from iTunes API & stores in
	//database if they don't already exist
	public function getItunes($query){

		//Itunes API key
		$ITUNES_AFFILIATE_URL = '';
		$LIMIT = 50;

		//Format string to strip spaces and add "+"
		$queryExplode = explode(" ", $query);
		$queryImplode = implode("+", $queryExplode);

		//API Url
		$itunesQuery = "https://itunes.apple.com/search?term=" . $queryImplode . "&limit=" . (string)$LIMIT;

		//Query API -Returns JSON
		$itunesResponse = file_get_contents($itunesQuery);
		$itunesResponse = json_decode($itunesResponse, true);



		foreach($itunesResponse["results"] as $result){


			Itunes::insert(array(
					'query'						=> $query,
					'wrapper_type'				=>(empty($result["wrapperType"]))				? " " : $result["wrapperType"],
					'kind'						=>(empty($result["kind"]))						? " " : $result["kind"],
					'artist_id'					=>(empty($result["artistId"]))					? " " : $result["artistId"],
					'collection_id'				=>(empty($result["collectionId"]))				? " " : $result["collectionId"],
					'track_id'					=>(empty($result["trackId"]))					? " " : $result["trackId"],
					'artist_name'				=>(empty($result["artistName"]))				? " " : $result["artistName"],
					'collection_name'			=>(empty($result["collectionName"]))			? " " : $result["collectionName"],
					'track_name'				=>(empty($result["trackName"]))					? " " : $result["trackName"],
					'artist_view_url'			=>(empty($result["artistViewUrl"]))				? " " : $result["artistViewUrl"],
					'collection_view_url'		=>(empty($result["collectionViewUrl"]))			? " " : $result["collectionViewUrl"],
					'track_view_url'			=>(empty($result["trackViewUrl"]))				? " " : $result["trackViewUrl"],
					'img_30'					=>(empty($result["artworkUrl30"]))				? " " : $result["artworkUrl30"],
					'img_60'					=>(empty($result["artworkUrl60"]))				? " " : $result["artworkUrl60"],
					'img_100'					=>(empty($result["artworkUrl100"]))				? " " : $result["artworkUrl100"],
					'collection_price'			=>(empty($result["collectionPrice"]))			? " " : $result["collectionPrice"],
					'track_price'				=>(empty($result["trackPrice"]))				? " " : $result["trackPrice"],
					'release_date'				=>(empty($result["releaseDate"]))				? " " : $result["releaseDate"],
					'collection_explicitness'	=>(empty($result["collectionExplicitness"]))	? " " : $result["collectionExplicitness"],
					'track_explicitness'		=>(empty($result["trackExplicitness"]))			? " " : $result["trackExplicitness"],
					'disc_count'				=>(empty($result["discCount"]))					? " " : $result["discCount"],
					'disc_number'				=>(empty($result["discNumber"]))				? " " : $result["discNumber"],
					'track_count'				=>(empty($result["trackCount"]))				? " " : $result["trackCount"],
					'track_number'				=>(empty($result["trackNumber"]))				? " " : $result["trackNumber"],
					'length_ms'					=>(empty($result["trackTimeMillis"]))			? " " : $result["trackTimeMillis"],
					'country'					=>(empty($result["country"]))					? " " : $result["country"],
					'currency'					=>(empty($result["currency"]))					? " " : $result["currency"],
					'primary_genre'				=>(empty($result["primaryGenreName"]))			? " " : $result["primaryGenreName"],
					'station_url'				=>(empty($result["radioStationUrl"]))			? " " : $result["radioStationUrl"]
			));
		}
	}









	public function getSongs($query){

		//Get songs form songs table where artist, album,
		//song_title, or genre match the client query
		$getSongs = Songs::where('song_title', 'LIKE', '%' . $query . '%')
			->orWhere('query', 'LIKE', '%' . $query . '%')
			->orWhere('youtube_title', 'LIKE', '%' . $query . '%')
			->orWhere('artist', 'LIKE', '%' . $query . '%')
			->orWhere('album', 'LIKE', '%' . $query . '%')
			->orWhere('genre', 'LIKE', '%' . $query . '%')
			->get();

		return $getSongs;
	}













}