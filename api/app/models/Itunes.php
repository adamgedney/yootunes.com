<?php



class Itunes extends Eloquent{

	protected $table = 'itunes_results';
	protected $fillable = array('wrapper_type', 'kind', 'artist_id', 'collection_id',
		'track_id', 'artist_name', 'collection_name', 'track_name', 'artist_view_url',
		'collection_view_url', 'track_view_url', 'img_30', 'img_60', 'img_100',
		'collection_price', 'track_price', 'release_date', 'collection_explicitness', 'track_explicitness',
		'disc_count', 'disc_number', 'track_count', 'track_number', 'length_ms', 'country',
		'currency', 'primary_genre', 'station_url');


}