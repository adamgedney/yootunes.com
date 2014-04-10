<?php


class User extends Eloquent{

	protected $table = "user";

	protected $fillable = array('username', 'email', 'full_name', 'avatar', 'password', 'deleted_at', 'registered_with', 'plus_id', 'gender', 'display_name', 'plus_etag');



}