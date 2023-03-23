#!/bin/bash

git clone https://github.com/deviantony/docker-elk.git
cd docker-elk

cat <<EOF >logstash/pipeline/logstash.conf
input {
	beats {
		port => 5044
	}

	tcp {
		port => 50000
	}
}

## Add your filters / logstash plugins configuration here
filter {
	json {
		source => "message"
	}
}

output {
	elasticsearch {
		hosts => "elasticsearch:9200"
		user => "logstash_internal"
		password => "${LOGSTASH_INTERNAL_PASSWORD}"
	}
}
EOF

docker compose up 

# localhost:5601
# elastic:changeme

