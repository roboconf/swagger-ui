class ParameterView extends Backbone.View
  initialize: ->

  render: ->
    @model.isBody = true if @model.paramType == 'body'
    @model.isFile = true if @model.dataType == 'file'

    template = @template()
    $(@el).html(template(@model))

    signatureModel =
      sampleJSON: @model.sampleJSON
      isParam: true
      signature: @model.signature

    if @model.sampleJSON
      signatureView = new SignatureView({model: signatureModel, tagName: 'div'})
      $('.model-signature', $(@el)).append signatureView.render().el
    else
      $('.model-signature', $(@el)).html(@model.signature)

    isParam = false

    if @model.isBody
      isParam = true

    contentTypeModel =
      isParam: isParam

    contentTypeModel.consumes = @model.consumes

    if isParam
      parameterContentTypeView = new ParameterContentTypeView({model: contentTypeModel})
      $('.parameter-content-type', $(@el)).append parameterContentTypeView.render().el

    else
      responseContentTypeView = new ResponseContentTypeView({model: contentTypeModel})
      $('.response-content-type', $(@el)).append responseContentTypeView.render().el

    @

  # Return an appropriate template based on if the parameter is a list, readonly, required
  template: ->
    if @model.isList
      Handlebars.templates.param_list
    else
      if @options.readOnly
        if @model.required
          Handlebars.templates.param_readonly_required
        else
          Handlebars.templates.param_readonly
      else
        if @model.required
          Handlebars.templates.param_required
        else
          Handlebars.templates.param
