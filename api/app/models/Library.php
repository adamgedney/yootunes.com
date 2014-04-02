<?php


class Library extends Eloquent{

	//Set the song data
	public static function setSong($tinyData, $ytResult, $type)
	{


		$song = '';
		$artist = '';
		$album = '';

		//Determine accurate data where available
		if($type == "artist"){

			$artist = $tinyData->artist_name;

		}else if($type == "album"){

			$album = $tinyData->album_name;

		}else{//type == song

			$song = $tinyData->song_name;
		}


		//==============================================//
		//Searches title and description for additional metadata.
		//Song titles and artists are not searched by description as
		//Track lists could exist in descriptions. Album seems to be a
		//safe search in desctiption.


		//Search YouTube title for SONG name string
		//Assume this is a result of that song
		$songCheck = strpos($ytResult->title, $tinyData->song_name);
		if($songCheck != false){
			$song = $tinyData->song_name;
		}


		//Search YouTube title for ARTIST name string
		//Assume this is a result form that artist
		$artistCheck = strpos($ytResult->title, $tinyData->artist_name);
		if($artistCheck != false){
			$artist = $tinyData->artist_name;
		}


		//Search YouTube description & title for ALBUM name string
		//Assume this is a result from that album
		$albumCheckTitle = strpos($ytResult->title, $tinyData->album_name);
		$albumCheckDesc = strpos($ytResult->description, $tinyData->album_name);
		if($albumCheckTitle != false || $albumCheckDesc != false){
			$album = $tinyData->album_name;
		}






		//Insert merged data into table
		$insert = DB::table('songs')->insert(array(
			'query' => $ytResult->query,
			'song_title' => $song,
			'youtube_title' => $ytResult->title,
			'artist' => $artist,
			'album' => $album,
			'genre' => '',
			'description' => $ytResult->description,
			'youtube_id' => $ytResult->video_id,
			'img_default' => $ytResult->img_default,
			'img_medium' => $ytResult->img_medium,
			'img_high' => $ytResult->img_high,
			'length' => '',
			'youtube_results_id' => $ytResult->id
		));



		//Return boolean for success/fail
		return $insert;
	}

}