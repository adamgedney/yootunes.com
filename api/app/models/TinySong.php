<?php

//Removed implements auth from here

class TinySong extends Eloquent{

	//Table used by Model
	protected $table = 'tinysong';

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	// protected $hidden = array('password');
	//Might not need the above




	//Set the query results to database
	public function setResults($query, $url, $songId, $songName, $artistId, $artistName, $albumId, $albumName)
	{
		DB::table('name')->insert(array('query' => $query, 'url' => $url, 'song-id' => $songId, 'song_name' => $songName, 'artist_id' => $artistId, 'artist_name' => $artistName, 'album_id' => $albumId, 'album_name' => $albumName ));


		return $this->getKey();
	}



	//Get the results for a query form database
	public function getResults($query)
	{
		return $this->getKey();
	}


}