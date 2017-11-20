# -*- coding: utf-8 -*-
import pytest


@pytest.fixture(scope="function")
def sections(request, discussion, test_session):
    """Create default sections."""
    from assembl.models import Section, LangString
    discussion_id = discussion.id

    sections = []
    homepage_section = Section(
        discussion_id=discussion_id,
        title=LangString.create(u'Home', 'en'),
        url=u'',
        section_type=u'HOMEPAGE',
        order=0.0
    )
    sections.append(homepage_section)
    debate_section = Section(
        discussion_id=discussion_id,
        title=LangString.create(u'Debate', 'en'),
        url=u'',
        section_type=u'DEBATE',
        order=1.0
    )
    sections.append(debate_section)
    syntheses_section = Section(
        discussion_id=discussion_id,
        title=LangString.create(u'Syntheses', 'en'),
        url=u'',
        section_type=u'SYNTHESES',
        order=2.0
    )
    sections.append(syntheses_section)
    resources_center_section = Section(
        discussion_id=discussion_id,
        title=LangString.create(u'Resources center', 'en'),
        url=u'',
        section_type=u'RESOURCES_CENTER',
        order=3.0
    )
    sections.append(resources_center_section)

    for section in sections:
        test_session.add(section)
    test_session.flush()

    def fin():
        print "finalizer sections"
        for section in sections:
            test_session.delete(section)
        test_session.flush()
    request.addfinalizer(fin)

    return sections
