import React from 'react';
import SurveyMakeChoiceForm from './SurveyMakeChoiceForm';

const SurveyMakeQuestionDelBox = React.createClass({
  render() {
    return <button className="survey-make-question-delete-button" type="button" name={this.props.questionId} onClick={this.props.onClick}>질문 삭제</button>;
  }
});

/*
 * props
 *  - onQuestionChange
 *  - onQuestionDelete
 *  - onQuestionAdd
 *  - questions: map of (questionId -> object)
 *    - question
 *    - type
 *    - choices: map of (choiceId -> text)
 */

const SurveyMakeQuestionForm = React.createClass({
  handleQuestionChange(questionId) {
    return e => {
      this.props.onQuestionChange(questionId, {
        ...this.props.questions[questionId],
        question: e.target.value
      });
    };
  },

  handleTypeChange(questionId) {
    return e => {
      this.props.onQuestionChange(questionId, {
        ...this.props.questions[questionId],
        type: e.target.checked ? 'select-many' : 'select-one'
      });
    };
  },

  handleChoiceChange(questionId) {
    const question = this.props.questions[questionId];
    return (choiceId, value) => {
      this.props.onQuestionChange(questionId, {
        ...question,
        choices: {
          ...question.choices,
          [choiceId]: value
        }
      });
    };
  },

  handleChoiceDelete(questionId) {
    const question = this.props.questions[questionId];
    return choiceId => {
      const newChoices = {};
      for (const oldChoiceId in question.choices) {
        if ({}.hasOwnProperty.call(question.choices, oldChoiceId)) {
          if (oldChoiceId != choiceId) {
            newChoices[oldChoiceId] = question.choices[oldChoiceId];
          }
        }
      }
      this.props.onQuestionChange(questionId, {
        ...question,
        choices: newChoices
      });
    };
  },

  handleChoiceAdd(questionId) {
    const question = this.props.questions[questionId];
    return () => {
      let maxId = -1;
      for (const choiceId in question.choices) {
        if ({}.hasOwnProperty.call(question.choices, choiceId)) {
          maxId = Math.max(maxId, choiceId);
        }
      }
      this.props.onQuestionChange(questionId, {
        ...question,
        choices: {
          ...question.choices,
          [maxId + 1]: ''
        }
      });
    };
  },

  handleDelete(e) {
    const questionId = Number(e.target.name);
    this.props.onQuestionDelete(questionId);
  },

  handleAdd() {
    this.props.onQuestionAdd();
  },

  render() {
    const {questions} = this.props;
    const questionIds = [];
    for (const questionId in questions) {
      if ({}.hasOwnProperty.call(questions, questionId)) {
        questionIds.push(questionId);
      }
    }
    questionIds.sort((i, j) => i - j);

    const questionForms = questionIds.map(questionId => {
      return (
        <div className="survey-make-question-form" key={questionId}>
          질문: <input type="text" name="question" onChange={this.handleQuestionChange(questionId)}/>
          중복 허용: <input type="checkbox" onChange={this.handleTypeChange(questionId)}/>
          답변: <SurveyMakeChoiceForm
            onChoiceChange={this.handleChoiceChange(questionId)}
            onChoiceDelete={this.handleChoiceDelete(questionId)}
            onChoiceAdd={this.handleChoiceAdd(questionId)}
            questionId={questionId}
            choices={this.props.questions[questionId].choices}
            />
          <SurveyMakeQuestionDelBox questionId={questionId} onClick={this.handleDelete}/>
        </div>
      );
    });

    return (
      <div className="survey-make-question-form-container">
        {questionForms}
        <button id="survey-make-question-add-button" type="button" onClick={this.handleAdd}>질문 추가</button>
      </div>
    );
  }
});

export default SurveyMakeQuestionForm;