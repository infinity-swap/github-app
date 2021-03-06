const core = require('@actions/core')
const short_link_view_slack = require('./shortLinkVeiwSlack');

function createMessage() {
  let json_from_github = core.getInput("json_from_github", {});
  let warn_message = core.getInput("warn_message", {});
  let fallback_text = core.getInput("fallback_text", {});
  json_from_github = json_parse(json_from_github);
  let message = {};

  if (fallback_text !== undefined && fallback_text !== '') {
    message["text"] = fallback_text;
  }

  if (!isEmpty(json_from_github)) {
    message["blocks"] = [];

    if ("event" in json_from_github) {
      if ("release" in json_from_github.event) {
        message.blocks.push(
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": `${json_from_github.event.release.name} is published!`
            }
          }
        )
      }

      if (warn_message !== "**" && warn_message !== '') {
        message.blocks.push(
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `*${ warn_message }*`
            }
          }
        )
      }

      if ("repository" in json_from_github.event) {
        message.blocks.push(
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `*Repository:* ${ json_from_github.event.repository.name }`
            }
          }
        )
      }

      if ("release" in json_from_github.event) {
        message.blocks.push(
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `*Tag:* ${ json_from_github.event.release.tag_name }`
            }
          }
        );

        message.blocks.push(
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `*Author:* ${ json_from_github.actor }`
            }
          }
        )

        message.blocks.push(
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "*Information:*"
              }
            }
        );

        message.blocks.push(
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": short_link_view_slack(json_from_github.event.release.body)
              },
              "accessory": {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Go to Release",
                  "emoji": true
                },
                "value": "click_me_123",
                "url": json_from_github.event.release.html_url,
                "action_id": "button-action"
              }
            }
        )
      }
    }
  }

  return message;
}


function json_parse(json) {
  try {
    return JSON.parse(json);
  }
  catch(e) {
    return {};
  }
}


function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

module.exports = createMessage
