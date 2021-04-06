ARG ELK_VERSION

# https://github.com/elastic/logstash-docker
FROM docker.elastic.co/logstash/logstash-oss:${ELK_VERSION}

# Add your logstash plugins setup here
# Example: RUN logstash-plugin install logstash-filter-json

COPY config/logstash.yml /usr/share/kibana/config/logstash.yml
COPY pipeline/* /usr/share/logstash/pipeline/