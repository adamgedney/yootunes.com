<?php


class Songs extends Eloquent{

	protected $fillable = array('query', 'song_title', 'youtube_title', 'artist', 'album', 'genre', 'description',
		'youtube_id', 'img_default', 'img_medium', 'img_high', 'length', 'youtube_results_id');




}