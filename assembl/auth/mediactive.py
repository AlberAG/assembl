from urllib import urlencode
from HTMLParser import HTMLParser

from simplejson import loads
from social.backends.base import BaseAuth

from .encryption import MediactiveAESCryptor


class Mediactive(BaseAuth):
    name = 'mediactive'
    USERNAME_KEY = 'username'
    html_parser = HTMLParser()

    def auth_url(self):
        """Must return redirect URL to auth provider"""
        next_url = self.data.get('next', None)
        base = self.setting('LOGIN_URL')
        if next_url:
            base += '?' + urlencode({'next': next_url})
        return base

    def get_user_id(self, details, response):
        """Return current user id."""
        return response['id']

    def clean(self, s):
        return self.html_parser.unescape(s).title()

    def get_user_details(self, response):
        """Return user basic information (id and email only)."""
        return {'email': response['email'],
                'first_name': self.clean(response['firstname']),
                'last_name': self.clean(response['lastname'])}

    def auth_complete(self, *args, **kwargs):
        """Completes login process, must return user instance."""
        mediactiveDecrypter = MediactiveAESCryptor(self.setting('SECRET'))
        data = loads(mediactiveDecrypter.decrypt(self.data['data']))
        kwargs.update({'response': data, 'backend': self})
        return self.strategy.authenticate(*args, **kwargs)
