<?php


class Playlists extends Eloquent {

	// protected $table = 'playlists';
	protected $fillable = array('id', 'name', 'user_id', 'share_url', 'is_shared');


}