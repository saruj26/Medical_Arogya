import logging
import requests
import json
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import ChatSession, ChatMessage
from .serializers import ChatSessionSerializer, ChatMessageSerializer

logger = logging.getLogger(__name__)

class AIService:
    @staticmethod
    def generate_medical_response(user_message: str) -> str:
        """Generate medical response using Google Gemini"""
        
        # Try Gemini first
        response = AIService._call_gemini_direct(user_message)
        if response:
            return response
            
        # Fallback to rule-based responses
        return AIService._fallback_reply(user_message)
    
    @staticmethod
    def _call_gemini_direct(prompt: str) -> str:
        """Call Gemini API directly using HTTP requests"""
        try:
            api_key = getattr(settings, 'GOOGLE_AI_KEY', None)
            if not api_key:
                logger.warning("Google Gemini API key not configured")
                return None

            # Medical system prompt
            system_prompt = """You are MedAssist AI, a helpful medical information assistant. 

IMPORTANT GUIDELINES:
- Provide accurate, general health information from reliable sources
- NEVER diagnose medical conditions or prescribe treatments
- ALWAYS recommend consulting healthcare professionals for personal medical advice
- Be empathetic, clear, and professional in your responses
- For emergencies, advise immediate medical attention
- Use simple language that's easy to understand
- Include appropriate disclaimers about not being a medical professional

Always include this disclaimer at the end: "Disclaimer: I am an AI assistant and not a qualified healthcare professional. This information is for educational purposes only. Please consult a doctor for medical advice."

User Question: """

            full_prompt = system_prompt + prompt

            # Use the working model from your test
            working_models = [
                "gemini-2.5-flash-preview-05-20",
                "gemini-2.0-flash-001",
                "gemini-2.0-flash-lite-001",
                "gemini-flash-latest",
            ]
            
            for model_name in working_models:
                try:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                    
                    headers = {
                        'Content-Type': 'application/json',
                    }
                    
                    data = {
                        "contents": [{
                            "parts": [{
                                "text": full_prompt
                            }]
                        }],
                        "generationConfig": {
                            "maxOutputTokens": 800,
                            "temperature": 0.3,
                            "topP": 0.8,
                            "topK": 40
                        },
                        "safetySettings": [
                            {
                                "category": "HARM_CATEGORY_HARASSMENT",
                                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                "category": "HARM_CATEGORY_HATE_SPEECH", 
                                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                            }
                        ]
                    }
                    
                    response = requests.post(url, headers=headers, json=data, timeout=30)
                    
                    if response.status_code == 200:
                        result = response.json()
                        if 'candidates' in result and len(result['candidates']) > 0:
                            text = result['candidates'][0]['content']['parts'][0]['text']
                            logger.info(f"✅ Successfully used model: {model_name}")
                            return text
                    elif response.status_code == 429:
                        logger.warning(f"⚠️ Rate limit hit for {model_name}, trying next model...")
                        continue
                    else:
                        logger.warning(f"Model {model_name} returned status {response.status_code}")
                        
                except Exception as model_error:
                    logger.warning(f"Model {model_name} failed: {str(model_error)}")
                    continue
            
            logger.error("All Gemini models failed or rate limited")
            return None

        except Exception as e:
            logger.error(f"Google Gemini HTTP error: {str(e)}")
            return None
    
    @staticmethod
    def _fallback_reply(user_message: str) -> str:
        """Fallback responses when Gemini is not available"""
        text = user_message.lower()
        
        medical_responses = {
            'fever': "Fever is usually a sign your body is fighting infection. Common causes include viral or bacterial infections. Make sure to stay hydrated and rest. If fever is high (over 103°F/39.4°C), persists more than 3 days, or is accompanied by severe symptoms, please consult a healthcare provider.\n\n*Disclaimer: I am an AI assistant and not a qualified healthcare professional. This information is for educational purposes only. Please consult a doctor for medical advice.*",
            
            'headache': "Headaches can have many causes including stress, dehydration, tension, or underlying conditions. Rest in a quiet room, stay hydrated, and consider over-the-counter pain relief if appropriate. If headaches are severe, sudden, or persistent, please see a doctor for proper evaluation.\n\n*Disclaimer: I am an AI assistant and not a qualified healthcare professional. This information is for educational purposes only. Please consult a doctor for medical advice.*",
            
            'cough': "Coughs can be due to colds, allergies, or other respiratory conditions. Stay hydrated, use a humidifier, and consider honey for soothing. If cough persists more than 3 weeks, causes breathing difficulty, or is accompanied by fever, seek medical attention.\n\n*Disclaimer: I am an AI assistant and not a qualified healthcare professional. This information is for educational purposes only. Please consult a doctor for medical advice.*",
            
            'covid': "If you suspect COVID-19, follow current public health guidelines including testing and isolation. Monitor symptoms closely and contact a healthcare provider for guidance. Seek emergency care for severe symptoms like difficulty breathing.\n\n*Disclaimer: I am an AI assistant and not a qualified healthcare professional. This information is for educational purposes only. Please consult a doctor for medical advice.*",
            
            'pain': "Pain is your body's way of signaling something might be wrong. The appropriate response depends on the location, severity, and duration. For severe, sudden, or persistent pain, please consult a healthcare professional for proper evaluation.\n\n*Disclaimer: I am an AI assistant and not a qualified healthcare professional. This information is for educational purposes only. Please consult a doctor for medical advice.*",
            
            'stress': "Stress can affect both mental and physical health. Techniques like deep breathing, exercise, adequate sleep, and mindfulness can help. If stress is overwhelming or affecting daily life, consider speaking with a mental health professional.\n\n*Disclaimer: I am an AI assistant and not a qualified healthcare professional. This information is for educational purposes only. Please consult a doctor for medical advice.*",
            
            'default': "Thank you for your health question. I can provide general medical information, but I'm not a substitute for professional medical advice. For personalized guidance or concerning symptoms, please consult with a qualified healthcare provider who can properly evaluate your situation.\n\n*Disclaimer: I am an AI assistant and not a qualified healthcare professional. This information is for educational purposes only. Please consult a doctor for medical advice.*"
        }
        
        for keyword, response in medical_responses.items():
            if keyword in text and keyword != 'default':
                return response
        
        return medical_responses['default']


class ChatSessionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Use prefetch_related to optimize database queries
        sessions = ChatSession.objects.filter(user=request.user)\
            .prefetch_related('messages')\
            .order_by('-updated_at')
        serializer = ChatSessionSerializer(sessions, many=True)
        return Response({'success': True, 'sessions': serializer.data})

    def post(self, request):
        # Log auth header for debugging frontend auth issues
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        logger.info(f"Chat session create called. Auth header: {auth_header}")

        title = request.data.get('title') or 'Medical Consultation'
        session = ChatSession.objects.create(user=request.user, title=title)
        
        # Use the updated serializer
        serializer = ChatSessionSerializer(session)
        return Response({'success': True, 'session': serializer.data}, status=status.HTTP_201_CREATED)


class ChatMessageListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get_session(self, session_id, user):
        try:
            return ChatSession.objects.get(id=session_id, user=user)
        except ChatSession.DoesNotExist:
            return None

    def get(self, request, session_id):
        session = self.get_session(session_id, request.user)
        if not session:
            return Response({'success': False, 'message': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get messages with proper ordering
        msgs = session.messages.all().order_by('created_at')
        serializer = ChatMessageSerializer(msgs, many=True)
        return Response({'success': True, 'messages': serializer.data})

    def post(self, request, session_id):
        session = self.get_session(session_id, request.user)
        if not session:
            return Response({'success': False, 'message': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

        user_content = request.data.get('content', '').strip()
        if not user_content:
            return Response({'success': False, 'message': 'Empty content'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Save user message
            user_msg = ChatMessage.objects.create(
                session=session, 
                sender='user', 
                content=user_content
            )

            # Generate AI response using Gemini
            assistant_text = AIService.generate_medical_response(user_content)
            
            # Save assistant message
            assistant_msg = ChatMessage.objects.create(
                session=session, 
                sender='assistant', 
                content=assistant_text
            )

            # Update session timestamp
            session.save()

            # Serialize the response
            user_msg_data = ChatMessageSerializer(user_msg).data
            assistant_msg_data = ChatMessageSerializer(assistant_msg).data

            return Response({
                'success': True, 
                'user_message': user_msg_data, 
                'assistant_message': assistant_msg_data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.exception('Error handling chat message')
            return Response({
                'success': False, 
                'message': 'Internal server error while processing message'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)