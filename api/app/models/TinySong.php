<?php



class TinySong extends Eloquent{


	protected $table = 'tinysong_results';
	protected $fillable = array('query', 'url', 'song_id', 'song_name', 'artist_id', 'artist_name', 'album_id', 'album_name');


	// //Set the query results to database
	// public static function setResults($query, $tinyResponse)
	// {

	// 	//Loop through tinysong result json and insert into database
	// 	foreach(json_decode($tinyResponse) as $result){
			// $insert = DB::table('tinysong_results')->insert(array('query' => $query, 'url' => $result->Url, 'song_id' => $result->SongID, 'song_name' => $result->SongName, 'artist_id' => $result->ArtistID, 'artist_name' => $result->ArtistName, 'album_id' => $result->AlbumID, 'album_name' => $result->AlbumName ));

	// 	}

	// 	//Tells the Search Controller when merge is ok
	// 	Event::fire('tiny.saved', array($query));


	// 	//Return boolean for success/fail
	// 	return $insert;
	// }





	// //Get the results for a query from database
	// public static function getResults($query)
	// {
	// 	$resultArray = array();

	// 	//Query DB on "query"
	// 	$results = DB::table('tinysong_results')->where('query', '=', $query)->get();

	// 	foreach($results as $r){
	// 		array_push($resultArray, $r);
	// 	}

	// 	return $resultArray;
	// }


}