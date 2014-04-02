<?php


class YouTube extends Eloquent{




	//Set the query results to database
	public static function setResults($query, $ytResponse)
	{

		//Loop through tinysong result json and insert into database
		foreach(json_decode($ytResponse)->items as $result){



			$insert = DB::table('youtube_results')->insert(array(
				'query' => $query,
				'etag' => $result->etag,
				'video_id' => $result->id->videoId,
				'title' => $result->snippet->title,
				'description' => $result->snippet->description,
				'img_default' => $result->snippet->thumbnails->default->url,
				'img_medium' => $result->snippet->thumbnails->medium->url,
				'img_high' => $result->snippet->thumbnails->high->url
			));

		}

		//Return boolean for success/fail
		return $insert;
	}





	//Get the results for a query from database
	public static function getResults($query)
	{
		$resultArray = array();

		//Query DB on "query"
		$results = DB::table('youtube_results')->where('query', '=', $query)->get();

		foreach($results as $r){
			array_push($resultArray, $r);
		}

		return $resultArray;
	}


}