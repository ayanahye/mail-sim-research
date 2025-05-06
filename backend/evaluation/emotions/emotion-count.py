import os
import pandas as pd

emotion_dir = "..//emotion"
caring_counts = []

for filename in os.listdir(emotion_dir):
    if filename.endswith("_emotions.csv"):
        file_path = os.path.join(emotion_dir, filename)
        try:
            data = pd.read_csv(file_path)
            first50 = data.head(50)
            #print(len(first50))
            caring_count = 0

            for val in first50['emotions']:
                first_emotion = val.split(",")[0].strip()
                #print(first_emotion)
                if first_emotion == 'caring':
                    caring_count += 1

            caring_counts.append(caring_count)
            print(f"{filename}: {caring_count} / 50 responses")
            print(f"{filename}: {caring_count/50 * 100} percent")
        except Exception as e:
            print(f'error: {e}')


'''
llm_evaluation_results_mistral_emotions.csv: 48 / 50 responses
llm_evaluation_results_mistral_emotions.csv: 96.0 percent
llm_evaluation_results_gemma-2-9b_emotions.csv: 39 / 50 responses
llm_evaluation_results_gemma-2-9b_emotions.csv: 78.0 percent
llm_evaluation_results_deepseek-r1_rm_emotions.csv: 49 / 50 responses
llm_evaluation_results_deepseek-r1_rm_emotions.csv: 98.0 percent
llm_evaluation_results_llama3.2_emotions.csv: 50 / 50 responses
llm_evaluation_results_llama3.2_emotions.csv: 100.0 percent
llm_evaluation_results_llama3-8b_emotions.csv: 46 / 50 responses
llm_evaluation_results_llama3-8b_emotions.csv: 92.0 percent
'''