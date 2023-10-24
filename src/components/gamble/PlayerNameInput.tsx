import React, { FormEvent } from "react";
import AutoSuggest from "react-autosuggest";

export type PlayerNameInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className: string;
};

const suggestions = [
  "Hà",
  "Linh",
  "Long",
  "Luân",
  "Minh",
  "Thuận",
  "Tuấn",
  "Tuyến",
];

export default function PlayerNameInput(props: PlayerNameInputProps) {
  const [availableSuggestions, setAvailableSuggestions] =
    React.useState(suggestions);

  return (
    <AutoSuggest
      suggestions={availableSuggestions}
      inputProps={{
        ...props,
        onChange: (
          _e: FormEvent<HTMLElement>,
          { newValue }: { newValue: string }
        ) => {
          props.onChange(newValue);
        },
      }}
      renderSuggestion={(suggestion: string) => <div>{suggestion}</div>}
      getSuggestionValue={(suggestion: string) => suggestion}
      onSuggestionsFetchRequested={({ value }: { value: string }) => {
        setAvailableSuggestions(
          suggestions.filter(
            (s) => s.toLowerCase().indexOf(value.toLowerCase()) !== -1
          )
        );
      }}
      shouldRenderSuggestions={(value: string, reason: string) => {
        return value.length >= 0;
      }}
    />
  );
}
