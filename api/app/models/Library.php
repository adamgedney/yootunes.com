<?php


class Library extends Eloquent{

	//Set the song data
	public static function setSong($tinyData, $yt, $type)
	{

		//** Create a loop to loop through ALL tinyData results on the query to check for song titles etc..


		$songFilter = $tinyData->song_name;
		$artistFilter = $tinyData->artist_name;
		$albumFilter = $tinyData->album_name;

		$song = '';
		$artist = '';
		$album = '';


		var_dump($yt[0]);
		//=======================Assumptions Engine=======================//
		//Searches title and description for additional metadata.
		//Song titles and artists are not searched by description as
		//Track lists could exist in descriptions. Album seems to be a
		//safe search in desctiption.
		// $songCheckTitle = strpos(strtolower($yt[0]->title), strtolower($songFilter));
		// $artistCheckTitle = strpos(strtolower($yt->title), strtolower($artistFilter));
		// $artistCheckDesc = strpos(strtolower($yt->description), strtolower($artistFilter));
		// $albumCheckTitle = strpos(strtolower($yt->title), strtolower($tinyData->album_name));
		// $albumCheckDesc = strpos(strtolower($yt->description), strtolower($tinyData->album_name));



		// //**Song names check requires more to prove this result is the correct song
		// //Search YouTube TITLE for SONG name & ARTIST name
		// if($songCheckTitle != false && $artistCheckTitle != false){
		// 	$song = $songFilter;
		// 	$artist = $artistFilter;
		// }

		// //Search YouTube TITLE & DESC for SONG name & ARTIST name
		// if($songCheckTitle != false && $artistCheckDesc != false){
		// 	$song = $songFilter;
		// 	$artist = $artistFilter;
		// }


		// //Search YouTube TITLE for ARTIST name string
		// if($artistCheckTitle != false){
		// 	$artist = $artistFilter;
		// }


		// //Search YouTube DESC for ARTIST name string
		// if($artistCheckDesc != false){
		// 	$artist = $artistFilter;
		// }


		// //Search YouTube TITLE or DESC for ALBUM name string
		// if($albumCheckTitle != false || $albumCheckDesc != false){
		// 	$album = $albumFilter;
		// }





		// //===========================================//
		// //Insert merged data into table==============//
		// //===========================================//
		// $insert = DB::table('songs')->insert(array(
		// 	'query' => $yt->query,
		// 	'song_title' => $song,
		// 	'youtube_title' => $yt->title,
		// 	'artist' => $artist,
		// 	'album' => $album,
		// 	'genre' => '',
		// 	'description' => $yt->description,
		// 	'youtube_id' => $yt->video_id,
		// 	'img_default' => $yt->img_default,
		// 	'img_medium' => $yt->img_medium,
		// 	'img_high' => $yt->img_high,
		// 	'length' => '',
		// 	'youtube_results_id' => $yt->id
		// ));



		// //Return boolean for success/fail
		// return $insert;
	}

}