<?php

//Removed implements auth from here

class TinySong extends Eloquent{


	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	// protected $hidden = array('password');
	//Might not need the above




	//Set the query results to database
	public static function setResults($query, $tinyResponse)
	{


		foreach(json_decode($tinyResponse) as $result){
			$insert = DB::table('tinysong')->insert(array('query' => $query, 'url' => $result->Url, 'song_id' => $result->SongID, 'song_name' => $result->SongName, 'artist_id' => $result->ArtistID, 'artist_name' => $result->ArtistName, 'album_id' => $result->AlbumID, 'album_name' => $result->AlbumName ));

		}


		// return $insert;
	}



	//Get the results for a query form database
	public static function getResults($query)
	{
		return $this->getKey();
	}


}