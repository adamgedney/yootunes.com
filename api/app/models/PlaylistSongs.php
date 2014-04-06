<?php


class PlaylistSongs extends Eloquent {

	protected $table = 'playlist_songs';
	protected $fillable = array('playlist_id', 'song_id');


}