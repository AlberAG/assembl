# -*- coding: utf-8 -*-
from datetime import datetime
from sqlalchemy import func

from assembl.models.notification import (
    ModelEventWatcherNotificationSubscriptionDispatcher)
from assembl.models import Username


def test_subscribe_to_discussion(
        test_session, discussion, participant2_user):
    test_session.flush()
    #Removing the following assert makes the test pass.  Obviously it has the side
    # effect that the nest time we use it, the data in the relationship is stale
    assert discussion not in participant2_user.participant_in_discussion, "The user should not already be subscribed to the discussion for this test"
    participant2_user.subscribe(discussion)
    test_session.flush()
    test_session.refresh(participant2_user)
    assert discussion in participant2_user.participant_in_discussion, "The user should now be subscribed to the discussion"
    participant2_user.unsubscribe(discussion)
    test_session.flush()
    assert discussion in participant2_user.participant_in_discussion, "The user should no longer be subscribed to the discussion"


def test_general_expiry(
        test_session, participant1_user, participant1_social_account, discussion):
    long_ago = datetime(2000, 1, 1)
    now = datetime.utcnow()
    # if all logins are old, our login is expired
    participant1_user.last_assembl_login = long_ago
    participant1_social_account.last_checked = long_ago
    assert participant1_user.login_expired(discussion)
    # if either social or assembl login is recent, our login is valid
    participant1_user.last_assembl_login = now
    assert not participant1_user.login_expired(discussion)
    participant1_user.last_assembl_login = long_ago
    participant1_social_account.last_checked = now
    assert not participant1_user.login_expired(discussion)


def test_restricted_discussion_expiry(
        test_session, participant1_user, participant1_social_account,
        closed_discussion):
    long_ago = datetime(2000, 1, 1)
    now = datetime.utcnow()
    # if our logins are old, our login is still expired
    participant1_user.last_assembl_login = long_ago
    participant1_social_account.last_checked = long_ago
    assert participant1_user.login_expired(closed_discussion)
    # if our last login was through assembl, no change
    participant1_user.last_assembl_login = now
    assert participant1_user.login_expired(closed_discussion)
    # only appropriate social login counts
    participant1_user.last_assembl_login = long_ago
    participant1_social_account.last_checked = now
    assert not participant1_user.login_expired(closed_discussion)


def test_restricted_discussion_expiry_override(
        test_session, admin_user, admin_social_account, closed_discussion):
    long_ago = datetime(2000, 1, 1)
    now = datetime.utcnow()
    # if our logins are old, our login is still expired
    admin_user.last_assembl_login = long_ago
    admin_social_account.last_checked = long_ago
    assert admin_user.login_expired(closed_discussion)
    # if our last login was through assembl, works because override
    admin_user.last_assembl_login = now
    assert not admin_user.login_expired(closed_discussion)
    # appropriate social login still counts
    admin_user.last_assembl_login = long_ago
    admin_social_account.last_checked = now
    assert not admin_user.login_expired(closed_discussion)


<<<<<<< HEAD
def test_case_insensitive_search_on_username(
        test_session, discussion, participant1_username):
    # participant1_username has 'Test.Username' as username
    # a search on the lowercase version should return one result
    assert test_session.query(Username).filter(
        func.lower(Username.username) == 'test.username').count()


def test_all_cookie_accepted_agents(test_session, participant2_user, asid2, discussion):
=======
def test_all_cookie_accepted_agents(test_session, participant2_user, agent_status_in_discussion_2, discussion):
>>>>>>> Remove pdb; PEP8; do NOT name fixtures ambigiously - change agsid to agent_status_iin_discussion
    from assembl.models import User
    assert participant2_user not in User.all_cookie_accepted_agents(discussion)
    assert participant2_user in User.all_rejected_cookie_agents(discussion)


<<<<<<< HEAD
def test_get_all_users_who_refused_cookies(test_session, participant1_user, participant2_user, asid2):
    from assembl.models import User
    all_users_who_refused_cookies = User.get_all_users_who_refused_cookies()
    assert participant2_user not in all_users_who_refused_cookies
    assert participant1_user in all_users_who_refused_cookies


def test_read_cookies_json(test_session, asid2):
    user_cookies = asid2.read_cookies()
    cookies_list = "cookie1, cookie2, cookie3"
    assert user_cookies == cookies_list
    user_cookies = asid2.read_cookies()
    assert user_cookies == cookies_list


def test_update_cookies_json(test_session, asid2):
    user_cookies = asid2.read_cookies()
    asid2.update_cookies("cookie4")
    user_cookies = asid2.read_cookies()
    assert user_cookies == "cookie1,cookie2,cookie3,cookie4"


def test_delete_cookie(test_session, participant1_user):
    cookie = "cookie1"
    participant1_user.delete_cookie(cookie)
    user_cookies = participant1_user.read_cookies_json()
    cookies_list = "cookie2,cookie3,cookie4"
    assert user_cookies == cookies_list


def test_all_rejected_cookie_agents(test_session, participant2_user, asid3, discussion):
=======
def test_all_rejected_cookie_agents(test_session, participant2_user, agent_status_in_discussion_3, discussion):
>>>>>>> Remove pdb; PEP8; do NOT name fixtures ambigiously - change agsid to agent_status_iin_discussion
    from assembl.models import User
    assert participant2_user in User.all_cookie_accepted_agents(discussion)
    assert participant2_user not in User.all_rejected_cookie_agents(discussion)


def test_has_not_accepted_cookies(test_session, agent_status_in_discussion_2):
    assert not agent_status_in_discussion_2.has_accepted_cookies


def test_has_accepted_cookies(test_session, agent_status_in_discussion_3):
    assert agent_status_in_discussion_3.has_accepted_cookies


def test_read_empty_cookies(test_session, agent_status_in_discussion_2):
    """Test Read Cookies for a user who has not accepted cookies."""
    assert agent_status_in_discussion_2.cookies == []


def test_read_cookies(test_session, agent_status_in_discussion_3):
    """Test Read cookies on a user who has accepted one cookie"""
    from assembl.models.cookie_types import CookieTypes
    assert agent_status_in_discussion_3.cookies == [CookieTypes.ACCEPT_CGU]


def test_update_cookies_2(test_session, agent_status_in_discussion_2):
    """Testing update cookies on a user who has not yet accepted cookies"""
    from assembl.models.cookie_types import CookieTypes
    agent_status_in_discussion_2.update_cookie("ACCEPT_TRACKING_ON_DISCUSSION")
    assert agent_status_in_discussion_2.read_cookies == [CookieTypes.ACCEPT_TRACKING_ON_DISCUSSION]


def test_update_cookies_3(test_session, agent_status_in_discussion_3):
    """Testing update cookies on a user who has already accepted one cookie"""
    from assembl.models.cookie_types import CookieTypes
    agent_status_in_discussion_3.update_cookie("ACCEPT_TRACKING_ON_DISCUSSION")
    assert agent_status_in_discussion_3.read_cookies == [CookieTypes.ACCEPT_CGU, CookieTypes.ACCEPT_TRACKING_ON_DISCUSSION]


def test_delete_cookie(test_session, agent_status_in_discussion_3):
    """Testing delete cookie on a user who has accepted a cookie."""
    agent_status_in_discussion_3.delete_cookie("ACCEPT_CGU")
    assert agent_status_in_discussion_3.read_cookies == []

<<<<<<< HEAD
def test_delete_cookie_2(test_session, asid2):
    """Testing delete cookie on a user who has not accepted any cookie."""
    asid2.delete_cookie("ACCEPT_CGU")
    assert asid2.read_cookies == []
=======

def test_delete_cookie_2(test_session, agent_status_in_discussion_2):
    """Testing delete cookie on a user who has not accepted any cookie."""
    agent_status_in_discussion_2.delete_cookie("ACCEPT_CGU")
    assert agent_status_in_discussion_2.read_cookies == []
>>>>>>> Remove pdb; PEP8; do NOT name fixtures ambigiously - change agsid to agent_status_iin_discussion
