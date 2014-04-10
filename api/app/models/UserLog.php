<?php


class UserLog extends Eloquent{

	protected $table = "user_log";

	protected $fillable = array('user_id', 'reset_token', 'status');



}