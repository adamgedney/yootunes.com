<?php


class Playlists extends Eloquent {

	// protected $table = 'playlists';
	protected $fillable = array('name', 'user_id', 'share_url', 'is_shared');


}