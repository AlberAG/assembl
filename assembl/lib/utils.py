import re
import unidecode
import inspect
from StringIO import StringIO

from pyramid.settings import asbool

from . import config


def get_eol(text):
    """Return the EOL character sequence used in the text."""
    line = StringIO(text).readline()
    return line[len(line.rstrip('\r\n')):]


def slugify(str):
    str = unidecode.unidecode(str).lower()
    return re.sub(r'\W+', '-', str)


def get_subclasses_recursive(c):
    """Recursively returns the classes is a class hierarchy"""
    subclasses = c.__subclasses__()
    for d in list(subclasses):
        subclasses.extend(get_subclasses_recursive(d))
    return subclasses


def get_concrete_subclasses_recursive(c):
    """Recursively returns only the concrete classes is a class hierarchy"""
    concreteSubclasses = []
    subclasses = get_subclasses_recursive(c)
    for d in subclasses:
        if not inspect.isabstract(d):
            concreteSubclasses.append(d)
    return concreteSubclasses


def get_base_url():
    """ Abstracted so that we can support virtual hosts or communities in
    the future and access the urls when we can't rely on pyramid's current
    request (such as when celery generates notifications
    """
    port = config.get('public_port')
    if port is not None:
        port = int(port)
    accept_secure_connection = asbool(config.get('accept_secure_connection'))
    require_secure_connection = asbool(config.get('require_secure_connection'))
    service = 'http'
    if accept_secure_connection or require_secure_connection:
        if port is None or port == 443:
            service += 's'
            portString = ''
        elif port == 80:
            if require_secure_connection:
                assert "Do not use secure connection on 80"
            else:
                portString = ''
        else:
            if require_secure_connection:
                service += 's'
            portString = (':'+port)
    else:
        if port is not None and port != 80:
            portString = (':'+port)
    return '%s://%s%s' % (service, config.get('public_hostname'), portString)
