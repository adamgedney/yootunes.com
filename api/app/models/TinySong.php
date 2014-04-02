<?php


class TinySong extends Eloquent{




	//Set the query results to database
	public static function setResults($query, $tinyResponse)
	{
		$insert = null;

		//Loop through tinysong reult json and insert into database
		foreach(json_decode($tinyResponse) as $result){
			$insert = DB::table('tinysong_results')->insert(array('query' => $query, 'url' => $result->Url, 'song_id' => $result->SongID, 'song_name' => $result->SongName, 'artist_id' => $result->ArtistID, 'artist_name' => $result->ArtistName, 'album_id' => $result->AlbumID, 'album_name' => $result->AlbumName ));

		}

		//Return boolean for success/fail
		return $insert;
	}





	//Get the results for a query from database
	public static function getResults($query)
	{
		$resultArray = array();

		//Query DB on "query"
		$results = DB::table('tinysong_results')->where('query', '=', $query)->get();

		foreach($results as $r){
			array_push($resultArray, $r);
		}

		return $resultArray;
	}


}