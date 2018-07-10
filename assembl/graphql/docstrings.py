# -*- coding:utf-8 -*-


class Default:
    required_language_input = """A locale input is required to specify in which language the content should be returned."""
    langstring_entries = """A list of possible languages of the entity as LangStringEntry objects. %s"""
    document = """%sA file metadata object, described by the Document object."""
    string_entry = """A %s in a given language."""
    float_entry = """A %s  as a float"""
    node_id = """The Relay.Node ID type of the %s object."""


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
    __doc__ = """Class to model the synthesis of a discussion. A synthesis is one of the core features of Assembl that a debate administrator
    uses to synthesize the main ideas of a debate. It has an introduction and a conclusion"""
    subject = """The subject of the synthesis."""
    subject_entries = Default.langstring_entries % ("The subject in various languages.",)
    introduction = """The introduction of the synthesis."""
    introduction_entries = Default.langstring_entries % ("The introduction in various languages.",)
    conclusion = """The conclusion of the synthesis."""
    conclusion_entries = Default.langstring_entries % ("This is the conclusion of the synthesis in different languages.",)
    ideas = """This is the list of ideas related to the synthesis."""
    img = Default.document % ("""The img field is a header image URL/document object that will be visible on the Synthesis view's header.""")
    creation_date = """The creation date of the synthesis."""
    post = """Synthesis post to be created."""


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
    extract_nature = r"""The taxonomy (or classification) of the extracted body. The options are one of:\n\n
        issue: The body of text is an issue.\n
        actionable_solution: The body of text is a potentially actionable solution.\n
        knowledge: The body of text is in fact knowledge gained by the community.\n
        example: The body of text is an example in the context that it was derived from.\n
        concept: The body of text is a high level concept.\n
        argument: The body of text is an argument for/against in the context that it was extracted from.\n
        cognitive_bias: The body of text, in fact, has cognitive bias in the context it was extracted from.\n
    """
    extract_action = r"""The taxonomy (or classification) of the actions that can be taken from the extracted body. The options are one of:\n\n
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


class Locale:
    __doc__ = """The Locale object describing the language model."""
    locale_code = """The ISO 639-1 locale code of the language of choice."""
    label = """The name of the locale, in a specifically given language."""


class Video:
    __doc__ = """The Video subsection in an Idea (or Thematic). This object describes the contents surrounding the video module."""
    title = Default.string_entry % ("Title of the video.")
    description_top = Default.string_entry % ("Description on top side of the video.")
    description_bottom = Default.string_entry % ("Description on bottom side of the video.")
    description_side = Default.string_entry % ("Description on one of the sides of the video.")
    html_code = Default.string_entry % ("")
    title_entries = Default.langstring_entries % ("Title of the video in various languages.")
    description_entries_top = Default.langstring_entries % ("Description on the top of the video in various languages.")
    description_entries_bottom = Default.langstring_entries % ("Description on the bottom of the video in various languages.")
    description_entries_side = Default.langstring_entries % ("Description on the side of the video in various languages.")


class VoteResults:
    __doc__ = """The metadata describing the resulting votes on a Thematic or Idea."""
    num_participants = """The count of participants on the vote session."""
    participants = """The list of users who participated on the vote session. The length of the list matches the number of participants."""


class IdeaInterface:
    __doc__ = """An Idea or Thematic is an object describing a classification or cluster of discussions on a debate.
    Ideas, like Posts, can be based on each other."""
    num_posts = "The total number of active posts on that idea (excludes deleted posts)."
    num_total_posts = "The total number of posts on that idea and on all its children ideas."
    num_contributors = r"""The total number off users who contributed to the Idea/Thematic/Question.\n
    Contribution is counted as either as a sentiment set, a post created."""
    num_children = "The total number of children ideas (called \"subideas\") on the Idea or Thematic."
    img = Default.document % "Header image associated with the idea. "
    order = "The order of the Idea, Thematic, Question in the idea tree."
    live = """The IdeaUnion between an Idea or a Thematic. This can be used to query specific fields unique to the type of Idea."""
    message_view_override = r"""Use a non-standard view for this idea.\nCurrently only supporting "messageColumns"\."""
    total_sentiments = "Total number of sentiments expressed by participants on posts related to that idea."
    vote_specifications = """The VoteSpecificationUnion placed on the Idea. This is the metadata describing the configuration of a VoteSession."""


class IdeaAnnouncement:
    __doc__ = """The metadata object describing an announcement banner on an Idea or Thematic.
    An Announcement is visible in the header of every Idea/Thematic."""
    title = Default.string_entry % ("title of Announcement")
    body = Default.string_entry % ("body of Announcement")


class IdeaMessageColumn:
    __doc__ = """The metadata object describing a single MessageColumn. Once a Thematic or Idea has a MessageColumn,
    the entity is under the message mode."""
    message_classifier = "The unique classification identifier of the MessageColumn. All content who will be put under this column must have this classifer."
    color = "The CSS based RGB HEX code of the theme colour chosen for this column."
    index = """The order of the message column in the Idea/Thematic."""
    idea = """The Idea/Thematic that the message column is associated with."""
    name = Default.string_entry % ("The name of the column")
    title = Default.string_entry % ("The title of the column")
    column_synthesis = """A Synthesis done on the column, of type Post."""
    num_posts = """The number of posts contributed to only this column."""


class Idea:
    __doc__ = """An Idea metadata object represents the configuration and classification of on idea that has grown from the debate.
    All ideas are currently created under a RootIdea, and Ideas can have subidea trees, Thematics and Questions associated to them."""
    title = "The title of the Idea, often shown in the Idea header itself."
    title_entries = Default.langstring_entries % ("This is the Idea title in multiple langauges.",)
    synthesis_title = Default.string_entry % ("Synthesis title",)
    description = "The description of the Idea, often shown in the header of the Idea."
    description_entries = Default.langstring_entries % ("The entity is the description of the Idea in multiple languages.",)
    children = """A list of all immediate child Ideas on the Idea, exluding any hidden Ideas. The RootIdea will not be shown here, for example.
    The subchildren of each subIdea is not shown here."""
    parent_id = Default.node_id % ("Idea",)
    posts = """A list of all Posts under the Idea. These include posts of the subIdeas."""
    contributors = """A list of participants who made a contribution to the idea by creating a post.
    A participant who only made a sentiment is not included."""
    announcement = """An Announcement object representing a summary of an Idea. This is often included in a header display of an Idea."""
    message_columns = """A list of IdeaMessageColumn objects, if any set, on an Idea."""
    ancestors = """A list of Relay.Node ID's representing the parents Ideas of the Idea."""
    vote_results = """The VoteResult object showing the status and result of a VoteSession on Idea."""


class Question:
    __doc__ = """A Question is a subtype of a Thematic, where each Thematic can ask multiple Questions in the Survey Phase.
    Each Question can have many Posts associated to it as a response."""
    num_posts = IdeaInterface.num_posts
    num_contributors = IdeaInterface.num_contributors
    title = """The Question to be asked itself, in the language given."""
    title_entries = Default.langstring_entries % ("")
    posts = """The list of all posts under the Question."""
    thematic = """The Thematic that the Question is categorized under. A Question, in the end, is an Idea type, as well as a Thematic."""
    total_sentiments = """The count of total sentiments """


class IdeaAnnoucement:
    title = "The title of the announcement."
    body = "The body of the announcement."


class QuestionInput:
    id = """Id of the question input."""
    title_entries = Default.langstring_entries % ("Title of the question in various languages.")


class VideoInput:
    title_entries = Default.langstring_entries % ("Title of the video in various languages.")
    description_entries_top = Default.langstring_entries % ("Description on the top of the video in various languages.")
    description_entries_bottom = Default.langstring_entries % ("Description on the bottom of the video in various languages.")
    description_entries_side = Default.langstring_entries % ("Description on the side of the video in various languages.")
    html_code = Default.string_entry % ("???")


class CreateIdea:
    __doc__ = """A mutation to create an idea."""
    title_entries = Idea.title_entries
    description_entries = Idea.description_entries
    image = Default.document % ("""Main image associated with this idea.""",)
    order = """The order or positioning of the Idea/Thematic compared to other Ideas."""
    parent_id = Idea.parent_id


class CreateThematic:
    __doc__ = """A mutation to create a new thematic."""
    title_entries = Default.langstring_entries % ("""Title of the thematic in different languages.""")
    description_entries = Default.langstring_entries % ("""Description of the thematic in different languages.""")
    identifier = Default.string_entry % ("""Thematic to be created. """)
    video = """Video to be integrated with the thematic."""
    questions = """List of Questions for the thematic."""
    image = Default.string_entry % ("Image to be shown in the thematic. ")
    order = Default.float_entry % (" Order of the thematic.")


class Thematic:
    __doc__ = """A Thematic is an Idea that exists under the Survey Phase of a debate.
    Thematics differ slightly from Ideas because Thematics' subideas are Questions."""
    identifier = "The phase identifier of the Thematic."
    title = Default.string_entry % "Title of the thematic"
    title_entries = CreateThematic.title_entries
    description = "Description of the thematic."
    questions = CreateThematic.questions
    video = CreateThematic.video


class UpdateThematic:
    __doc__ = "A mutation to update a thematic."
    id = "ID of the thematic to be updated."
    title_entries = CreateThematic.title_entries
    description_entries = CreateThematic.description_entries
    identifier = CreateThematic.identifier
    video = CreateThematic.video
    questions = CreateThematic.questions
    image = CreateThematic.image
    order = CreateThematic.order


class DeleteThematic:
    __doc__ = """A mutation to delete a thematic."""
    thematic_id = """Id of the thematic to be deleted."""


class LandingPageModuleType:
    __doc__ = """The metadata description of the types of modules (or sections) available in the landing page."""
    default_order = """The default order of this LandingPageModuleType in the context of the landing page."""
    editable_order = """A boolean flag indicating whether the LandingPageModuleType's order can be editeded or not."""
    identifier = """The unique ID of the module type. These can be one of:\n\n
        HEADER: The header section of the landing page.\n
        INTRODUCTION: The introduction section.\n
        TIMELINE: The list of timelines present in the debate.\n
        FOOTER: The footer in the landing page, including information such as privacy policies, etc..\n
        TOP_THEMATICS: The section hosting the top active thematics.\n
        TWEETS: The tweets section, displaying top tweets in the landing page.\n
        CHATBOT: The chatbot section, according to the configured chatbot.\n
        CONTACT: The contacts section.\n
        NEWS: The latest news section, as configured.\n
        DATA: The data sections.\n
        PARTNERS: The partners section, highlighting the contributing partners' logos.\n
    """
    required = """A Boolean flag defining if the section is required for the landing page or not."""
    title = """The title of the section."""
    title_entries = Default.langstring_entries % ("The Title will be available in every supported language.",)


class LandingPageModule:
    __doc__ = """The LandingPageModule configurations for the debate."""
    # TODO: Add more to the configuration description
    configuration = """The JSON-based configuration of the LandingPageModule in the debate."""
    order = """The order of the Module in the entire LandingPage."""
    enabled = """Whether the Module is activated or not."""
    module_type = """The LandingPageModuleType describing the Module."""
    exists_in_database = """A flag describign whether the module already exists in the database or not."""


class CreateLandingPageModule:
    __doc__ = """A mutation that allows for the creation of the LandingPageModule."""
    type_identifier = LandingPageModuleType.identifier
    enabled = LandingPageModule.enabled
    order = LandingPageModule.order
    configuration = LandingPageModule.configuration
    landing_page_module = """A LandingPageModules that is associated to the debate."""


class UpdateLandingPageModule:
    __doc__ = """A mutation that allows for updating an existing LandingPageModule."""
    id = Default.node_id % "LandingPageModule"
    enabled = LandingPageModule.enabled
    order = LandingPageModule.order
    configuration = LandingPageModule.configuration
    landing_page_module = CreateLandingPageModule.landing_page_module


class PostAttachment:
    document = Default.document % ("Any file that can be attached to a Post. ")


class IdeaContentLink:
    __doc__ = "An object representing a link between an Idea and a Post type (of any kind - there are multiple types of Posts)."
    idea_id = "Id of the Idea to be linked to the post."
    post_id = "Id of the post to be linked to the idea."
    creator_id = "Id of the user(participant) who created the link."
    type = Default.string_entry % (" . ")
    idea = "A graphene field representing a relationship to the idea to be linked."
    post = "A graphene field representing a relationship to the post to be linked."
    creator = "A graphene field reprensenting a relationship to the creator of the link."
    creation_date = "Date on which this link was created."


class PostInterface:
    creator = "The User object who created the Post entity."
    message_classifier = "The classification ID for a Post that is under a column view. The classifer must match the identifier of a message column."
    creation_date = "Date on which the post was created."
    modification_date = "Date of the modification of the post, if any."
    subject = Default.string_entry % ("Subject of the post")
    body = Default.string_entry % ("Body of the post (the main content of the post).")
    subject_entries = Default.langstring_entries % ("The subject of the post in various languages.")
    body_entries = Default.langstring_entries % ("The body of the post in various languages.")
    sentiment_counts = "A graphene field which contains the number of of each sentiment expressed (dont_understand, disagree, like, more info)"
    my_sentiment = "A graphene field which contains a list of sentiment types."
    indirect_idea_content_links = "List of links to ideas."
    extracts = "List of extracts related to that post."
    parent_id = """The parent of a Post, if the Post is a reply to an existing Post. """ + Default.node_id % ("Post")
    db_id = """The internal database ID of the post.
    This should never be used in logical computations, however, it exists to give the exact database id for use in sorting or creating classifiers for Posts."""
    body_mime_type = Default.string_entry % "???"
    publication_state = """A graphene Field containing the state of the publication of a certain post. The options are:
    DRAFT,\n
    SUBMITTED_IN_EDIT_GRACE_PERIOD,\n
    SUBMITTED_AWAITING_MODERATION,\n
    PUBLISHED,\n
    MODERATED_TEXT_ON_DEMAND,\n
    MODERATED_TEXT_NEVER_AVAILABLE,\n
    DELETED_BY_USER,\n
    DELETED_BY_ADMIN,\n
    WIDGET_SCOPED\n"""
    attachments = "List of attachements to the post."
    original_locale = Default.string_entry % ("Locale in which the original message was written.")
    publishes_synthesis = "Graphene Field modeling a relationship to a published synthesis."


class Post:
    __doc__ = "A Post object, representing a contribution made by a user."
    message_id = "The email-compatible message-id for the post."


class CreatePost:
    __doc__ = "A mutation which enables the creation of a post."
    subject = PostInterface.subject
    body = PostInterface.body
    idea_id = Default.node_id % ("Idea")
    # A Post (except proposals in survey phase) can reply to another post.
    # See related code in views/api/post.py
    parent_id = PostInterface.parent_id
    attachments = PostInterface.attachments
    message_classifier = PostInterface.message_classifier


class UpdatePost:
    __doc__ = "A mutation called when a Post is updated."
    post_id = "The graphene id of the Post to be updated."
    subject = "The updated subject of the Post."
    body = Default.string_entry % ("The updated body of the Post.")
    attachments = "The updated Attachments of the Post."


class DeletePost:
    __doc__ = "A mutation to delete a Post."
    post_id = "The graphene id of the Post to be deleted."


class UndeletePost:
    __doc__ = "A mutation called to resurrect Post after being deleted."
    post_id = "The graphene id of the Post to be undeleted."


class AddPostAttachment:
    __doc__ = "A mutation to add Attachment to a Post."
    post_id = "The graphene id of the Post to add an Attachement to."
    file = "The path of the file to be attached."


class DeletePostAttachment:
    post_id = "The graphene id from which to delete the Attachement."
    attachment_id = "The id of the Attachement to be deleted."


class AddPostExtract:
    __doc__ = "A mutation to harvest an Extract from a Post."
    post_id = "The graphene id of the Post from which to harvest an Extract."
    body = "The body of the Extract from the Post."
    important = "A boolean to set the Extract as a Nugget or not."
    xpath_start = TextFragmentIdentifier.xpath_start
    xpath_end = TextFragmentIdentifier.xpath_end
    offset_start = TextFragmentIdentifier.offset_start
    offset_end = TextFragmentIdentifier.offset_end


class Document:
    __doc__ = """An SQLalchemytype class to model a document.
    In most cases, A document is used as an attachement to a post or a picture of a thematic, synthesis, etc ..."""
    external_url = Default.string_entry % ("A url to an image or a document to be attached.")
    av_checked = Default.string_entry % ("???")


class UploadDocument:
    file = Default.string_entry % ("The file to be uploaded.")


class SentimentCounts:
    __doc__ = """A class containing the number of sentiments expressed on a specific post.
    There are four sentiments in Assembl: dont_understand, disagree, like, more_info."""
    dont_understand = "The count of Sentiments expressing dont_understand on a specific Post."
    disagree = "The number of Sentiments disagreeing with the Post."
    like = "The count of positive Sentiments expressed on the Post."
    more_info = "The number of Sentiments requesting more info on the Post."


class AddSentiment:
    post_id = "The graphene id of the Post on which to express a Sentiment. A User can only add one Sentiment per Post."
    type = "The type of the Sentiment to be expressed on the Post. There are four sentiments in Assembl: dont_understand, disagree, like, more_info."


class DeleteSentiment:
    __doc__ = "A mutation to delete a Sentiment by the User. Since the User can only express one Sentiment per Post, it only takes a post_id as input."
    post_id = "The graphene id of the Post from which to remove an expressed Sentiment. A User can only remove a Sentiment that he expressed."


class DiscussionPhase:
    __doc__ = r"""Assembl has four possible phases:\n
    Survey,\n
    multicolumn,\n
    thread, voteSession."""
    identifier = Default.string_entry % (
        "The identifier of the Phase. Assembl has four possible Phase identifiers: Survey, Multicolumn, Thread, voteSession.")
    is_thematics_table = " "
    title = Default.string_entry % ("Title of the Phase.")
    title_entries = Default.langstring_entries % ("Title of the phase in various languages.")
    description = Default.string_entry % ("Description of the Phase.")
    description_entries = Default.langstring_entries % ("Description of the phase in various languages.")
    start = "The dateTime variable as the starting date of the Phase."
    end = "the dateTime variable as the end date of the Phase."
    image = Default.document % ("The image displayed on the phase.")
    order = Default.float_entry % ("Order of the phase in the Timeline.")


class CreateDiscussionPhase:
    __doc__ = DiscussionPhase.__doc__
    lang = Default.string_entry % (".")
    identifier = DiscussionPhase.identifier
    is_thematics_table = DiscussionPhase.is_thematics_table
    title_entries = DiscussionPhase.title_entries
    start = DiscussionPhase.start
    end = DiscussionPhase.end
    order = DiscussionPhase.order


class UpdateDiscussionPhase:
    __doc__ = DiscussionPhase.__doc__
    id = "The graphene id of the Phase to be updated."
    is_thematics_table = DiscussionPhase.is_thematics_table
    lang = CreateDiscussionPhase.lang
    identifier = DiscussionPhase.identifier
    title_entries = DiscussionPhase.title_entries
    description_entries = DiscussionPhase.description_entries
    start = DiscussionPhase.start
    end = DiscussionPhase.end
    image = DiscussionPhase.image
    order = DiscussionPhase.order


class DeleteDiscussionPhase:
    __doc__ = DiscussionPhase.__doc__
    id = "The graphene id of the Phase to be deleted."


class AgentProfile:
    __doc__ = "An abstract SQLalchemy class to model an AgentProfile."
    user_id = "The graphene id if the User."
    name = Default.string_entry % ("The name of the User. This Name will appear on all the activities done by the User on the Discussion.")
    username = Default.string_entry % ("The Username of the User.")
    display_name = Default.string_entry % ("???")
    email = "The email used by the User for identification."
    image = Default.document % ("Image appearing on the avatar of the User.")
    creation_date = "Datetime variable of the creation of the AgentProfile. It exists only on user not AgentProfile."
    has_password = "A boolean flag stating if the User has a password."
    is_deleted = "A boolean flag to state if the this User is deleted or not."


class UpdateUser:
    __doc__ = "A mutation with which a User can update his name, his username, his avatar image or his password."
    id = "The graphene id of the User to be updated."
    name = AgentProfile.name
    username = AgentProfile.username
    # this is the identifier of the part in a multipart POST
    image = AgentProfile.image
    old_password = "The old password to be submitted by the User in case he wants to change his password."
    new_password = "The new password to be submitted by the User in case he wants to change his password."
    new_password2 = "The retype of the new password to be submitted by the User in case he wants to change his password."


class DeleteUserInformation:
    __doc__ = """A mutation allowing a user to delete all his information according to article 17 of GDPR.
    It replaces all his personnal information with random strings."""
    id = "Id of the user to be deleted."


class VoteSession:
    __doc__ = r"""A Vote session is one of the four phases available in Assembl along with \n
    Survey,\n
    Multicolumn,\n
    thread)."""
    discussion_phase_id = " ??? "
    header_image = Default.document % ("The Image appearing at the header of the Vote session page.")
    vote_specifications = "A list of the vote specifications."
    proposals = "The list of Proposals on which the Participant will be allowed to vote."
    see_current_votes = "A boolean flag according to which the users will/won't be allowed to see the current votes."


class UpdateVoteSession:
    discussion_phase_id = VoteSession.discussion_phase_id
    header_image = VoteSession.header_image
    see_current_votes = VoteSession.see_current_votes


class VoteSpecificationInterface:
    title = Default.string_entry % ("The title of the Vote.")
    title_entries = Default.langstring_entries % ("The title of the Vote in various languages.")
    instructions = Default.string_entry % ("The instructions of the Vote.")
    instructions_entries = Default.langstring_entries % ("The instructions of the Vote in various languages.")
    is_custom = "A boolean flag specifying if the module has been customized for a specific Proposal."
    vote_session_id = "The graphene id of the Vote session to which this Vote is associated."
    vote_spec_template_id = "???"  # graphene.ID()
    vote_type = "Type of the Vote: Tokens or Gauge."
    my_votes = "The list of Votes by a specific User."
    num_votes = "The total number of Voters for this Vote."


class TokenCategorySpecification:
    __doc__ = "An SQLalchemy class to model the token in a Token Vote session."
    color = "A string corresponding to the color of the Token."
    typename = "The name of the Token."
    total_number = "The total number of Tokens allocated by Participant."
    title = Default.string_entry % ("The title of the Token Category.")
    title_entries = Default.langstring_entries % ("The title of the Token Category in various languages.")


class VotesByCategory:
    token_category_id = "The graphene id of the token Category."
    num_token = "The number of tokens on that Category."


class TokenVoteSpecification:
    __doc__ = "An SQLalchemy class to model the specifications of a token vote."
    exlusive_categories = "A boolean flag defining whether a Participant can submit his Vote to several Proposals."
    token_categories = "The list of Token category specification(TokenCategorySpecification)."
    token_votes = "The list of Token Votes (VotesByCategory)."


class GaugeChoiceSpecification:
    __doc__ = "An SQLalchemy class to model the specifications of a Gauge Vote."
    value = "???"
    label = Default.string_entry % ("The label of the Gauge.")
    label_entries = Default.langstring_entries % ("The label of the Gauge in various languages.")


class GaugeVoteSpecification:
    choices = "The list of choices available on a Gauge."
    average_label = Default.string_entry % ("The average Vote on a textual Gauge.")
    average_result = Default.float_entry % ("The average Vote on a numeric Gauge.")


class NumberGaugeVoteSpecification:
    minimum = "The minimum value on the Gauge."
    maximum = "The maximum value on the Gauge."
    nb_ticks = "An Integer representing the number of intervals between the minimum value and the maximum value."
    unit = "The unit used on the Gauge (could be USD, months, years, persons, etc ...)."
    average_result = "The average value of the Votes submitted by Participants."


class TokenCategorySpecificationInput:
    title_entries = TokenCategorySpecification.title_entries
    total_number = TokenCategorySpecification.total_number
    typename = TokenCategorySpecification.typename
    color = TokenCategorySpecification.color


class GaugeChoiceSpecificationInput:
    label_entries = GaugeChoiceSpecification.label_entries
    value = GaugeChoiceSpecification.value


class CreateTokenVoteSpecification:
    vote_session_id = VoteSpecificationInterface.vote_session_id
    proposal_id = "Id of the Proposal on the Participant will vote."
    title_entries = VoteSpecificationInterface.title_entries
    instructions_entries = VoteSpecificationInterface.instructions_entries
    is_custom = VoteSpecificationInterface.is_custom
    exclusive_categories = "A boolean flag to say whether the User can/can't vote on several Proposals."
    token_categories = TokenVoteSpecification.token_categories
    vote_spec_template_id = "???"


class UpdateTokenVoteSpecification:
    id = "The graphene id of the Token Vote to be updated."
    title_entries = VoteSpecificationInterface.title_entries
    instructions_entries = VoteSpecificationInterface.instructions_entries
    is_custom = VoteSpecificationInterface.is_custom
    exclusive_categories = CreateTokenVoteSpecification.exclusive_categories
    token_categories = TokenVoteSpecification.token_categories


class DeleteVoteSpecification:
    id = "The graphene id of the Vote Specification to be deleted."


class CreateGaugeVoteSpecification:
    vote_session_id = VoteSpecificationInterface.vote_session_id
    proposal_id = "Id of the Proposal on the users will vote."
    title_entries = VoteSpecificationInterface.title_entries
    instructions_entries = VoteSpecificationInterface.instructions_entries
    is_custom = VoteSpecificationInterface.is_custom
    choices = GaugeVoteSpecification.choices
    vote_spec_template_id = "???"  # graphene.ID()


class UpdateGaugeVoteSpecification:
    id = "The graphene id of the Gauge to be updated."
    title_entries = VoteSpecificationInterface.title_entries
    instructions_entries = VoteSpecificationInterface.instructions_entries
    is_custom = VoteSpecificationInterface.is_custom
    choices = GaugeVoteSpecification.choices


class CreateNumberGaugeVoteSpecification:
    __doc__ = "A Mutation to create a numerical Gauge. "
    vote_session_id = "The graphene id of the Vote session in which the numeric Gauge will be created."
    proposal_id = CreateGaugeVoteSpecification.proposal_id
    title_entries = VoteSpecificationInterface.title_entries
    instructions_entries = VoteSpecificationInterface.instructions_entries
    is_custom = VoteSpecificationInterface.is_custom
    minimum = NumberGaugeVoteSpecification.minimum
    maximum = NumberGaugeVoteSpecification.maximum
    nb_ticks = NumberGaugeVoteSpecification.nb_ticks
    unit = NumberGaugeVoteSpecification.unit
    vote_spec_template_id = CreateGaugeVoteSpecification.vote_spec_template_id


class UpdateNumberGaugeVoteSpecification:
    id = "The graphene id of the numerical Gauge Vote to be updated."
    title_entries = VoteSpecificationInterface.title_entries
    instructions_entries = VoteSpecificationInterface.instructions_entries
    is_custom = VoteSpecificationInterface.is_custom
    minimum = NumberGaugeVoteSpecification.minimum
    maximum = NumberGaugeVoteSpecification.maximum
    nb_ticks = NumberGaugeVoteSpecification.nb_ticks
    unit = NumberGaugeVoteSpecification.unit


class CreateProposal:
    vote_session_id = "The graphene ID of the Vote session containing the Proposal."
    title_entries = Default.langstring_entries % "The Proposal title in various languages."
    description_entries = Default.langstring_entries % "The Proposal description in various languages."
    order = "The order of the Proposal in the Vote session."


class UpdateProposal:
    id = "The graphene ID of the Proposal to be updated."
    title_entries = CreateProposal.title_entries
    description_entries = CreateProposal.description_entries
    order = CreateProposal.order


class DeleteProposal:
    id = "The graphene ID of the proposal to be deleted."


class VoteInterface:
    vote_date = "The date on which the Participant submitted his Vote."
    voter_id = "The graphene id of the voting Participant."
    vote_spec_id = "The graphene ID of the vote specification(see Vote Specification for more info)."  # graphene.ID(required=True)
    proposal_id = "The graphene ID of the Proposal on which the User has submitted his Vote."


class TokenVote:
    vote_value = "The number of Tokens used on a certain Vote."
    token_category_id = "The category of the Token used."


class GaugeVote:
    vote_value = "The value entered on the Gauge Vote."


class AddTokenVote:
    proposal_id = VoteInterface.proposal_id
    token_category_id = TokenVote.token_category_id  # graphene.ID(required=True)
    vote_spec_id = VoteInterface.vote_spec_id  # graphene.ID(required=True)
    vote_value = TokenVote.vote_value  # graphene.Int(required=True)
    vote_specification = "The specification of the Vote session."  # graphene.Field(lambda: TokenVoteSpecification)


class DeleteTokenVote:
    proposal_id = VoteInterface.proposal_id
    token_category_id = TokenVote.token_category_id
    vote_spec_id = VoteInterface.vote_spec_id


class AddGaugeVote:
    proposal_id = VoteInterface.proposal_id
    vote_spec_id = VoteInterface.vote_spec_id
    vote_value = GaugeVote.vote_value


class DeleteGaugeVote:
    proposal_id = AddGaugeVote.proposal_id
    vote_spec_id = VoteInterface.vote_spec_id
