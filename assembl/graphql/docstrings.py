# -*- coding:utf-8 -*-


class Default:
    required_language_input = """A locale input is required to specify in which language the content should be returned."""
    langstring_entries = """A list of possible languages of the entity as LangStringEntry objects. %s"""
    document = """%sA file metadata object, described by the Document object."""
    string_entry = """A %s in a given language."""


class Schema:
    node = """A Relay node. Any entity that uses the Relay object structure, along with connections (edges), can be queried from Node."""
    root_idea = """An idea union between either an Idea type or a Thematic type."""
    ideas = """List of all ideas on the debate."""
    thematics = """List of all thematics on the debate. Thematics are a subset of Ideas."""
    syntheses = """List of all syntheses on the debate."""
    num_participants = """The number of active participants on the debate with any form of contribution."""
    discussion_preferences = """
        The dicussion preferences of the debate.
        These are configurations that characterize how the debate will behave, look, and act under certain conditions."""
    default_preferences = """The default discussion preferences. These are server wide settings, independent of the debate."""
    locales = """The list of locales supported on the debate. These are the languages of the debate."""
    total_sentiments = """The total count of sentiments on the debate, regardless of chosen type. Deleted users' sentiments are not counted."""
    has_syntheses = """A boolean flag indicating if the debate has yet released a synthesis or not."""
    vote_session = """A vote session's meta data, if a vote session exists."""
    resources = """A list of Resource meta data on the debate."""
    resources_center = """A singular Resource Center meta data object."""
    has_resources_center = """A boolean flag indicating if the debate has a resource center set or not."""
    sections = """A list of Section meta data on the discussion."""
    legal_contents = """The legal contents metadata representing the data."""
    has_legal_notice = """A boolean flag of whether a debate has set a legal notice."""
    has_terms_and_conditions = """A boolean flag of whether a debate has set a terms and conditions page."""
    has_cookies_policy = """A boolean flag of whether a debate has set a cookie policy page."""
    has_privacy_policy = """A boolean flag of whether a debate has set a privacy policy page."""
    visits_analytics = """The object containing the summary data of analytics on the page, based on time-series analysis of analytics engine data."""
    discussion = """The discussion object metadata."""
    landing_page_module_types = """The metadata object for LandingPageModule object."""
    landing_page_modules = """A list of LandingPageModules."""
    text_fields = """A list of ConfigurableField union, where each text field represents a field on a bound entity."""
    profile_fields = """A list of ConfigurableField union, where each text field represents a field on a profile only."""
    timeline = """A list of DiscussionPhase objects, descriping the timeline objects on the debate."""


class Discussion:
    __docs__ = """The Discussion object. This object describes certain parts of the core state of the debate."""
    homepage_url = """A URL for the homepage (optional). Often placed on the logo."""
    title = """The title of the discussion, in the language specified by the input"""
    subtitle = """The subtitle of the discussion, in the language specified by the input"""
    button_label = """The value inside of the participation button in the landing page."""
    header_image = Default.document % ("The file representing the header of the landing page. ", )
    logo_image = Default.document % ("The file representing the logo of the debate. ", )


class UpdateDiscussion:
    __doc__ = """The mutation that allows to update an existing Discussion object"""
    header_image = Default.document % ("The header image that will be viewed on the discussion's landing page. ",)
    logo_image = Default.document % ("The smalller logo image that will be viewed on the discussion's navigation bar. ",)
    button_label_entries = """The contents inside of the \"follow\" button in the landing page."""
    title_entries = """The title contents shown on the landing page of a discussion, just above the \"follow\" button. """
    subtitle_entries = """The subtitle contents shown on the landing page of a discussion, just above the \"follow\" button, under the title content. """


class LangString:
    value = """The unicode encoded string representation of the content."""
    locale_code = """The ISO 639-1 locale code of the language the content represents."""
    translated_from_locale_code = """The ISO 639-1 locale code of the original content represented by the translated content presented."""
    supposed_understood = "A boolean that specifies if the language presented is understood by the user or not."
    error_code = "The error code thrown by the translation service when translating an entity. Could be null if no error occurs."


class LocalePreference:
    __doc__ = """The locale stored in the Discussion Preferences metadata object."""
    locale = """The ISO 639-1 language string of the locale. Ex. \'"fr"\'. """
    name = """The name of the locale, in the language of the locale given. Ex. French, if the given locale is \'"en"\'."""
    native_name = """The name of the locale, in the original language. Ex Français."""


class DiscussionPreferences:
    __doc__ = """A discussion can have many preferences. This metadata object describes these preferences."""
    languages = """A list of LocalePreference metadata objects on the discussion which describe the languages supported by the debate."""


class ResourcesCenter:
    __doc__ = """A Resource Center is a place where discussion related data can be stored for all to access. There can be zero or more
    Resource Centers created per discussion by a discussion administrator, and can be viewed by all members of the debate."""
    title = """The name of the resource center in a specific language."""
    title_entries = """The name of the resource center in all available languages"""
    header_image = Default.document % ("""The main image associated with the resource center""",)


class LegalContents:
    __doc__ = """The pages where you can see the legal informations regarding a debate."""
    legal_notice = Default.string_entry % ("Legal Notice",)
    terms_and_conditions = Default.string_entry % ("Terms and Conditions",)
    legal_notice_entries = Default.langstring_entries % ("",)
    terms_and_conditions_entries = Default.langstring_entries % ("",)
    cookies_policy = Default.string_entry % ("Cookie Policy",)
    privacy_policy = Default.string_entry % ("Privacy Policy",)
    cookies_policy_entries = Default.langstring_entries % ("",)
    privacy_policy_entries = Default.langstring_entries % ("",)


class UpdateResourcesCenter:
    __doc__ = """The mutation that allows to update existing Resource Center objects."""
    title_entries = Default.string_entry
    header_image = Default.document % ("""Update the main image associated with a ResourceCenter. """,)


class UpdateDiscussionPreferences:
    __doc__ = """A way to save Discussion Preferences on a debate."""
    languages = """The list of languages in ISO 639-1 locale code that the debate should support."""


class UpdateLegalContents:
    __doc__ = """A method to update the Legal Contents of a debate."""
    legal_notice_entries = Default.langstring_entries % ("This is the list of all Legal Notices in various languages.",)
    terms_and_conditions_entries = Default.langstring_entries % ("This is the list of all Terms and Conditions in various languages.",)
    cookies_policy_entries = Default.langstring_entries % ("This is the list of all Cookie Policies in various languages.",)
    privacy_policy_entries = Default.langstring_entries % ("This is the list of all Privay Policies in various languages.",)


class VisitsAnalytics:
    __doc__ = """This object describes the analytics data gathered on the debate throughout its total lifecycle. The analytics is carried out
    by Mamoto (formerly known as Piwik), an open-source anaytics engine."""
    sum_visits_length = """The total number of hours spent on the platform by all users."""
    nb_pageviews = """The total number of page views accumulated."""
    nb_uniq_pageviews = """The total number of unique page views."""


class Synthesis:
    subject = """The subject of the synthesis"""
    subject_entries = Default.langstring_entries % ("This is the subject in various languages.",)
    introduction = """This is the introduction of the synthesis"""
    introduction_entries = Default.langstring_entries % ("This is the introduction in various languages.",)
    conclusion = """This is the conclusion of the synthesis"""
    conclusion_entries = Default.langstring_entries % ("This is the conclusion of the synthesis in different languages.",)
    ideas = """This is the list of ideas related to the synthesis"""
    img = """This is the image to be posted at the top of the page of that synthesis"""
    creation_date = """The creation data of the synthesis"""
    post = """The synthesis post to be created"""


class TextFragmentIdentifier:
    __doc__ = """A text fragment metadata that describes the positioning of the fragment both in the DOM and its position in the string of text."""
    xpath_start = """The xPath selector starting point in the DOM, representing where the string text that the fragment is held is positioned."""
    offset_start = """The character offset index where an extract begins, beginning from index 0 in a string of text."""
    xpath_end = """The xPath selector ending point in the DOM, representing where the string text that the fragment is held is positioned.
    Often times the xpathEnd variable is the same as the xpathStart selector."""
    offset_end = """The character offset index where an extract ends in a string of text."""


class ExtractInterface:
    __doc__ = """An Extract is an extraction of text from a post which is deemed to be important by a priviledged user."""
    body = """The body of text that is extracted from the post. This is not language dependent, but rather just unicode text."""
    important = """A flag for importance of the Extract."""
    extract_nature = """The taxonomy (or classification) of the extracted body. The options are one of:\n\n
        issue: The body of text is an issue.\n
        actionable_solution: The body of text is a potentially actionable solution.\n
        knowledge: The body of text is in fact knowledge gained by the community.\n
        example: The body of text is an example in the context that it was derived from.\n
        concept: The body of text is a high level concept.\n
        argument: The body of text is an argument for/against in the context that it was extracted from.\n
        cognitive_bias: The body of text, in fact, has cognitive bias in the context it was extracted from.\n
    """
    extract_action = """The taxonomy (or classification) of the actions that can be taken from the extracted body. The options are one of:\n\n
        classify: This body of text should be re-classified by an priviledged user.\n
        make_generic: The body of text is a specific example and not generic.\n
        argument: A user must give more arguments.\n
        give_examples: A user must give more examples.\n
        more_specific: A user must be more specific within the same context.\n
        mix_match: The body of text has relevancy in another section of the deabte. These should be mixed and matched to create greater meaning.\n
        display_multi_column: A priviledged user should activate the Mutli-Column view.\n
        display_thread: A priviledged user should activate the Thread view.\n
        display_tokens: A priviledged user should activate the Token Vote view.\n
        display_open_questions: A priviledged user should activate the Open Question view.\n
        display_bright_mirror: A priviledged user should activate the Bright Mirror view.\n
    """
    text_fragment_identifiers = """A list of TextFragmentIdentifiers."""
    creation_date = """The date the Extract was created, in UTC timezone."""
    creator_id = """The id of the User who created the extract."""
    creator = """The AgentProfile object description of the creator."""


class UpdateExtract:
    __doc__ = """A mutation to update an existing extract."""
    extract_id = """The Relay.Node ID type of the Extract object to the updated."""
    idea_id = """The Relay.Node ID type of the Idea object associated to the Extract."""
    important = ExtractInterface.important
    extract_nature = ExtractInterface.extract_nature
    extract_action = ExtractInterface.extract_action
    body = ExtractInterface.body


class DeleteExtract:
    extract_id = UpdateExtract.extract_id
    success = """A Boolean of whether the extract was successfully saved or not."""
